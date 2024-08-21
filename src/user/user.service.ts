import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

import { User } from './models/user.model';
import { Role } from '../role/models/role.model';

import { RoleService } from 'src/role/role.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CandidateData } from 'src/candidate/models/candidate_data.model';
import { RecruiterData } from 'src/recruiter/models/recruiter.data.model';
import { PostgresErrorCode } from 'src/database/postgres-error-codes.enum';
import {
  CreateUserParams,
  UpdateUserParams,
} from './interfaces/user.interface';
import { AuthUser } from 'src/auth/model/auth_user.model';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { CandidateDataService } from 'src/candidate/candidate_data.service';
import { RecruiterDataService } from 'src/recruiter/recruiter_data.service';
import { PostcodesService } from 'src/3rd-party/postcodes.io/postcodes.service';
import { PricingPlanService } from 'src/pricing.plan/pricing_plan.service';
import { PricingPlan } from 'src/pricing.plan/models/pricing.plan.model';
import { Billing } from 'src/payment/models/billing.model';
import { PaymentService } from 'src/payment/payment.service';
import { transformUserData } from './features/transform.user';
import { Skill } from 'src/experience/models/skill.model';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly generalUserRelations = [
    {
      model: Role,
      as: 'role',
      attributes: ['role'],
    },
    {
      model: CandidateData,
      as: 'candidate_data',
      required: false,
      attributes: {
        exclude: ['created_at', 'updated_at', 'user_id'],
      },
    },
    {
      model: Skill,
      as: 'skills',
      required: false,
      through: { attributes: [] },
    },
    {
      model: RecruiterData,
      as: 'recruiter_data',
      required: false,
      attributes: {
        exclude: ['created_at', 'updated_at', 'user_id'],
      },
    },
    {
      model: Billing,
      as: 'billing',
      required: false,
      include: [
        {
          model: PricingPlan,
          as: 'pricing_plan',
          attributes: ['id', 'name', 'value', 'price_per_credit'],
        },
      ],
      attributes: ['credits'],
    },
  ];

  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(AuthUser) private readonly authUserRepository: typeof AuthUser,

    private readonly roleService: RoleService,
    private readonly candidateDataService: CandidateDataService,
    private readonly recruiterDataService: RecruiterDataService,
    private readonly pricingPlanService: PricingPlanService,
    private readonly paymentService: PaymentService,
    private readonly postcodesService: PostcodesService,
    private readonly sequelize: Sequelize,
  ) {}

  async createUserWithRoleInfo(
    signUpDTO: SignUpDTO,
    authUserId: string,
    t: Transaction,
  ): Promise<User> {
    const { role, userData, candidateData, recruiterData } = signUpDTO;

    const postcodeInfo = await this.postcodesService.lookupPostcode(
      userData.postcode,
    );

    const user = await this.create(
      {
        ...userData,
        postcode_longitude: postcodeInfo.longitude,
        postcode_latitude: postcodeInfo.latitude,
        auth_user_id: authUserId,
      },
      role,
      t,
    );

    if (role === 'candidate') {
      await this.candidateDataService.create(user.id, candidateData, t);
    } else if (role === 'recruiter') {
      const pricingPlan = await this.pricingPlanService.findOneByValue('free');

      await Promise.all([
        this.recruiterDataService.create(user.id, recruiterData, t),
        this.paymentService.createBillingInfo(
          user.id,
          {
            pricing_plan_id: pricingPlan.id,
            credits: pricingPlan.credits_included,
          },
          t,
        ),
      ]);
    }

    return user;
  }

  async create(
    userParams: CreateUserParams,
    role: string,
    t: Transaction,
  ): Promise<User> {
    try {
      const roleData = await this.roleService.findOneByValue(role);
      const user = await this.userRepository.create(
        {
          ...userParams,
          role_id: roleData.id,
        },
        { transaction: t },
      );

      return user;
    } catch (error) {
      this.logger.error(error);

      if (error?.name === PostgresErrorCode.UniqueError) {
        throw new HttpException(
          'User with that phone number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const users = await this.userRepository.findAll({
      attributes: {
        exclude: ['auth_user_id', 'created_at', 'updated_at'],
      },
      include: [
        { model: Role, as: 'role', attributes: ['role'] },
        {
          model: CandidateData,
          as: 'candidate_data',
          required: false,
          attributes: {
            exclude: ['created_at', 'updated_at', 'user_id'],
          },
        },
        {
          model: RecruiterData,
          as: 'recruiter_data',
          required: false,
          attributes: {
            exclude: ['created_at', 'updated_at', 'user_id'],
          },
        },
      ],
    });

    return users.map((user) => transformUserData(user.get({ plain: true })));
  }

  async findOne(id: string) {
    const user = await this.userRepository.findByPk(id, {
      include: [{ model: Role, as: 'role', attributes: ['role'] }],
      attributes: {
        exclude: ['role_id', 'created_at', 'updated_at'],
      },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    return user.get({ plain: true });
  }

  async getFullUserInfo(id: string) {
    const user = await this.userRepository.findByPk(id, {
      include: this.generalUserRelations,
      attributes: {
        exclude: ['role_id', 'created_at', 'updated_at'],
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const plainUser = user.get({ plain: true });

    return transformUserData(plainUser);
  }

  async getRole(userId: string) {
    const user = await this.findOne(userId);

    return user.role.role;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: [
        ...this.generalUserRelations,
        { model: AuthUser, as: 'auth_user' },
      ],
      attributes: {
        exclude: ['auth_user_id', 'role_id', 'created_at', 'updated_at'],
      },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    const plainUser = user.get({ plain: true });

    return transformUserData(plainUser);
  }

  async update(
    originalUser: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const {
        role: { role: userRole },
        postcode,
      } = originalUser;
      const { company_name, agreement_to_contact, ...otherUserData } =
        updateUserDto;

      const newUserData: UpdateUserParams = { ...otherUserData };

      if (postcode !== otherUserData.postcode) {
        const postcodeInfo = await this.postcodesService.lookupPostcode(
          otherUserData.postcode,
        );

        newUserData.postcode_longitude = postcodeInfo.longitude;
        newUserData.postcode_latitude = postcodeInfo.latitude;
      }

      return this.sequelize.transaction(async (t: Transaction) => {
        await this.userRepository.update(newUserData, {
          where: { id: originalUser.id },
          returning: true,
          transaction: t,
        });

        await this.authUserRepository.update(
          { email: newUserData.email },
          {
            where: { id: originalUser.auth_user_id },
            transaction: t,
          },
        );

        if (userRole === 'recruiter') {
          await this.recruiterDataService.update(
            originalUser.id,
            {
              company_name,
            },
            t,
          );
        } else if (userRole === 'candidate') {
          await this.candidateDataService.updateAgreementToContact(
            originalUser.id,
            agreement_to_contact,
            t,
          );
        }

        return Object.assign(originalUser, newUserData, {
          ...(userRole === 'recruiter' && {
            recruiter_data: {
              ...originalUser.recruiter_data,
              company_name,
            },
          }),
          ...(userRole === 'candidate' && {
            candidate_data: {
              ...originalUser.candidate_data,
              agreement_to_contact,
            },
          }),
        });
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Updating the personal information failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByPhoneNumber(phone_number: string) {
    return this.userRepository.findOne({
      where: { phone_number },
      include: [{ model: AuthUser, as: 'auth_user' }],
    });
  }
}
