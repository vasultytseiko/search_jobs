import { Injectable } from '@nestjs/common';
import { CreateRecruiterDataDto } from './dto/create-recruiter_data.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { RecruiterData } from './models/recruiter.data.model';

import { UpdateRecruiterDataDto } from './dto/update-recruiter_data.dto';

@Injectable()
export class RecruiterDataService {
  constructor(
    @InjectModel(RecruiterData)
    private readonly recruiterDataRepository: typeof RecruiterData,
  ) {}

  async create(
    userId: string,
    recruiterDataDto: CreateRecruiterDataDto,
    t: Transaction,
  ) {
    return await this.recruiterDataRepository.create(
      {
        ...recruiterDataDto,
        user_id: userId,
      },
      { transaction: t },
    );
  }

  async update(
    userId: string,
    updateRecruiterDataDto: UpdateRecruiterDataDto,
    t: Transaction,
  ) {
    return await this.recruiterDataRepository.update(
      { ...updateRecruiterDataDto },
      {
        where: { user_id: userId },
        transaction: t,
      },
    );
  }
}
