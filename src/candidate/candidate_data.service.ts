import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, QueryTypes } from 'sequelize';

import { CreateCandidateDataDto } from './dto/create-candidate_data.dto';
import { CandidateData } from './models/candidate_data.model';
import { UpdateCandidateDataDto } from './dto/update-candidate_data.dto';
import { CandidateSkill } from 'src/candidate/models/candidate_skill.model';
import { User } from 'src/user/models/user.model';
import { PersonalDocumentType } from './models/personal_document_type.model';
import { ExperienceDocumentType } from './models/experience_document_type.model';
import {
  CandidateVerification,
  DocumentStatus,
} from './models/candidate_verification.model';
import { CandidateDocumentsDto } from './dto/candidate_documents.dto';
import { CandidateVerificationDto } from './dto/candidate_verification.dto';
import { StorageService } from 'src/3rd-party/storage/storage.service';

import { SearchCandidateDto } from './dto/search-candidates.dto';

import {
  searchCandidatesHospitalityQuery,
  searchCandidatesConstructionQuery,
} from './sql/search-candidates';
import { PostcodesService } from 'src/3rd-party/postcodes.io/postcodes.service';
import { PostcodeInfo } from 'src/3rd-party/postcodes.io/postcodes.interface';
import { SearchCandidatesModel } from './candidate_data.interface';

@Injectable()
export class CandidateDataService {
  private readonly logger = new Logger(CandidateDataService.name);

  constructor(
    @InjectModel(CandidateData)
    private readonly candidateDataRepository: typeof CandidateData,
    @InjectModel(CandidateSkill)
    private readonly CandidateSkillRepository: typeof CandidateSkill,
    @InjectModel(PersonalDocumentType)
    private readonly personalDocumentTypeRepository: typeof PersonalDocumentType,
    @InjectModel(ExperienceDocumentType)
    private readonly experienceDocumentTypeRepository: typeof ExperienceDocumentType,
    @InjectModel(CandidateVerification)
    private readonly candidateVerificationRepository: typeof CandidateVerification,

    private readonly sequelize: Sequelize,
    private readonly storageService: StorageService,
    private readonly postcodesService: PostcodesService,
  ) {}

  async create(
    userId: string,
    candidateDataDto: CreateCandidateDataDto,
    t: Transaction,
  ) {
    if (candidateDataDto.skill_ids?.length) {
      await this.addSkills(userId, candidateDataDto.skill_ids, t);
    }

    return await this.candidateDataRepository.create(
      {
        ...candidateDataDto,
        user_id: userId,
      },
      { transaction: t },
    );
  }

  async searchCandidates(searchCandidateDto: SearchCandidateDto) {
    const {
      sector_id,
      hospitality_role_id,
      hospitality_establishment_id,
      construction_role_id,
      construction_card_type_id,
      years_experience_id,
      verified,
      skill_ids,
      distance,
      page_size,
      page,
    } = searchCandidateDto;

    if (construction_role_id && hospitality_role_id) {
      throw new HttpException(
        'Either construction or hospitality filters must be provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const skillsLength = searchCandidateDto.skill_ids?.length || 0;

      let filterPostcodeInfo: PostcodeInfo;
      if (searchCandidateDto.postcode) {
        filterPostcodeInfo = await this.postcodesService.lookupPostcode(
          searchCandidateDto.postcode,
        );
      }

      const offset = (page - 1) * page_size;

      const filters = {
        // Basic filters.
        skillIds: skill_ids || null,
        skillsLength,
        yearsExperienceId: years_experience_id || null,
        baseLatitude: filterPostcodeInfo?.latitude || null,
        baseLongitude: filterPostcodeInfo?.longitude || null,
        verified: verified || null,
        maxDistance: distance || null,
        pageSize: page_size,
        offset,

        // Sector filters.
        sectorId: sector_id,
        ...(hospitality_role_id !== undefined && {
          hospitalityRoleId: hospitality_role_id,
          hospitalityEstablishmentId: hospitality_establishment_id || null,
        }),
        ...(construction_role_id && {
          constructionRoleId: construction_role_id,
          constructionCardTypeId: construction_card_type_id || null,
        }),
      };

      const query =
        hospitality_role_id !== undefined
          ? searchCandidatesHospitalityQuery
          : searchCandidatesConstructionQuery;

      const candidates = await this.sequelize.query<SearchCandidatesModel>(
        query,
        {
          replacements: filters,
          type: QueryTypes.SELECT,
          nest: true,

          mapToModel: true,
        },
      );

      const total_count = candidates[0]?.total_count || 0;

      candidates.map((candidate) => {
        delete candidate.total_count;
        return candidate;
      });
      return { total_count, candidates };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Searching candidates failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateExperience(
    originalUser: User,
    updateCandidateDataDto: UpdateCandidateDataDto,
  ) {
    const { skills, ...otherUpdateCandidateData } = updateCandidateDataDto;

    try {
      await this.sequelize.transaction(async (t) => {
        const updPromises = [
          this.update(originalUser.id, otherUpdateCandidateData, t),
        ];

        await this.deleteCandidateSkills(originalUser.id, t);

        if (skills?.length) {
          updPromises.push(this.addSkills(originalUser.id, skills, t));
        }

        await Promise.all(updPromises);
      });

      return updateCandidateDataDto;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Updating the experience data failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    userId: string,
    updateCandidateDataDto: UpdateCandidateDataDto,
    t: Transaction,
  ) {
    await this.candidateDataRepository.update(
      { ...updateCandidateDataDto },
      {
        where: { user_id: userId },
        transaction: t,
      },
    );
  }

  async updateAgreementToContact(
    userId: string,
    agreementToContact: boolean,
    t: Transaction,
  ) {
    await this.candidateDataRepository.update(
      { agreement_to_contact: agreementToContact },
      { where: { user_id: userId }, transaction: t },
    );
  }

  private async addSkills(user_id: string, skills: string[], t: Transaction) {
    const arrayToInsert = skills.map((skill_id) => ({
      user_id,
      skill_id,
    }));

    await this.CandidateSkillRepository.bulkCreate(arrayToInsert, {
      transaction: t,
    });
  }

  private async deleteCandidateSkills(userId: string, t: Transaction) {
    await this.CandidateSkillRepository.destroy({
      where: { user_id: userId },
      transaction: t,
    });
  }

  async getDocumentTypes() {
    const [personalDocumentTypes, experienceDocumentTypes] = await Promise.all([
      this.personalDocumentTypeRepository.findAll(),
      this.experienceDocumentTypeRepository.findAll(),
    ]);

    return {
      personalDocumentTypes,
      experienceDocumentTypes,
    };
  }

  async getCandidateVerificationDocuments(userId: string) {
    return this.candidateVerificationRepository.findOne({
      where: { user_id: userId },
      attributes: {
        exclude: ['user_id', 'created_at', 'updated_at'],
      },
    });
  }

  async updateCandidateVerificationDocuments(
    userId: string,
    candidateDocumentsDto: CandidateDocumentsDto,
  ) {
    try {
      const {
        personal_document_name,
        experience_document_name,
        personal_document_type_id,
        experience_document_type_id,
        personal_document_uploaded,
        experience_document_uploaded,
      } = candidateDocumentsDto;

      const candidateVerification =
        await this.getCandidateVerificationDocuments(userId);

      const personalDocumentNameExists =
        !!candidateVerification?.personal_document_name;
      const experienceDocumentNameExists =
        !!candidateVerification?.experience_document_name;

      let updateData = {};
      const deletePromises = [];

      // The personal document name and type are required together.
      if (personal_document_name && personal_document_type_id) {
        const sameName =
          personal_document_name ===
          candidateVerification.personal_document_name;

        // Check if:
        // 1. the personal document is a newly uploaded file
        // 2. previous personal document file exists
        // 3. the new file name is different from the previous one (to avoid unnecessary file deletion)
        const personalDocumentChanged =
          personalDocumentNameExists && personal_document_uploaded && !sameName;

        // If it is, delete the old file.
        if (personalDocumentChanged) {
          deletePromises.push(
            this.storageService.deleteFile(
              userId,
              candidateVerification.personal_document_name,
            ),
          );
        }

        updateData = {
          ...updateData,
          personal_document_name: personal_document_uploaded
            ? personal_document_name
            : candidateVerification.personal_document_name,
          personal_document_type_id,
          // If the personal document is newly uploaded, set the status to pending.
          personal_document_status: personal_document_uploaded
            ? DocumentStatus.PENDING
            : candidateVerification?.personal_document_status,
        };
      } else {
        updateData = {
          ...updateData,
          personal_document_name: null,
          personal_document_type_id: null,
          personal_document_status: null,
        };

        // Clean up the personal document if it was removed.
        if (personalDocumentNameExists) {
          deletePromises.push(
            this.storageService.deleteFile(
              userId,
              candidateVerification.personal_document_name,
            ),
          );
        }
      }

      // The experience document name and type are required together.
      if (experience_document_name && experience_document_type_id) {
        const sameName =
          experience_document_name ===
          candidateVerification.experience_document_name;

        // Check if:
        // 1. the experience document is a newly uploaded file
        // 2. previous experience document file exists
        // 3. the new file name is different from the previous one (to avoid unnecessary file deletion)
        const experienceDocumentChanged =
          experienceDocumentNameExists &&
          experience_document_uploaded &&
          !sameName;

        // If it is, delete the old file.
        if (experienceDocumentChanged) {
          deletePromises.push(
            this.storageService.deleteFile(
              userId,
              candidateVerification.experience_document_name,
            ),
          );
        }

        updateData = {
          ...updateData,
          experience_document_name: experience_document_uploaded
            ? experience_document_name
            : candidateVerification.experience_document_name,
          experience_document_type_id,
          // If the experience document is newly uploaded, set the status to pending.
          experience_document_status: experience_document_uploaded
            ? DocumentStatus.PENDING
            : candidateVerification?.experience_document_status,
        };
      } else {
        updateData = {
          ...updateData,
          experience_document_name: null,
          experience_document_type_id: null,
          experience_document_status: null,
        };

        // Clean up the experience document if it was removed.
        if (experienceDocumentNameExists) {
          deletePromises.push(
            this.storageService.deleteFile(
              userId,
              candidateVerification.experience_document_name,
            ),
          );
        }
      }

      await this.sequelize.transaction(async (t) => {
        await Promise.all([
          this.candidateVerificationRepository.upsert(
            {
              ...updateData,
              user_id: userId,
            },
            {
              conflictFields: ['user_id'],
              transaction: t,
            },
          ),

          // Since the documents were updated, the candidate verification status should be reset.
          this.candidateDataRepository.update(
            { verified: false },
            { where: { user_id: userId }, transaction: t },
          ),
        ]);

        await Promise.all(deletePromises);
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Creating the candidate verification failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyCandidateDocuments(
    candidateVerificationDto: CandidateVerificationDto,
  ) {
    try {
      const { user_id, personal_document_status, experience_document_status } =
        candidateVerificationDto;

      let updateData = {};

      if (personal_document_status) {
        updateData = {
          ...updateData,
          personal_document_status,
        };
      }

      if (experience_document_status) {
        updateData = {
          ...updateData,
          experience_document_status,
        };
      }

      if (!Object.keys(updateData).length) {
        return;
      }

      const [, [updatedCandidateVerification]] =
        await this.candidateVerificationRepository.update(updateData, {
          where: { user_id },
          returning: true,
        });

      if (!updatedCandidateVerification) {
        throw new HttpException(
          "Candidate verification didn't succeed - candidate not found.",
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        personal_document_status: updatedPersonalDocumentStatus,
        experience_document_status: updatedExperienceDocumentStatus,
      } = updatedCandidateVerification;

      if (
        updatedPersonalDocumentStatus === DocumentStatus.APPROVED &&
        updatedExperienceDocumentStatus === DocumentStatus.APPROVED
      ) {
        await this.candidateDataRepository.update(
          { verified: true },
          { where: { user_id } },
        );
      } else if (
        updatedPersonalDocumentStatus === DocumentStatus.REJECTED ||
        updatedExperienceDocumentStatus === DocumentStatus.REJECTED
      ) {
        await this.candidateDataRepository.update(
          { verified: false },
          { where: { user_id } },
        );
      }
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }

      this.logger.error(error);
      throw new HttpException(
        'Verifying the candidate documents failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
