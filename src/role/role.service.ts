import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from './models/role.model';

import { ErrorHandler } from 'src/utils/ErrorHandler';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
  ) {}

  async findOneById(id: string) {
    try {
      const role = await this.roleRepository.findByPk(id);
      if (!role) {
        throw { message: 'role not found', status: HttpStatus.NOT_FOUND };
      }
      return role;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async findOneByValue(roleValue: string) {
    try {
      const role = await this.roleRepository.findOne({
        where: { role: roleValue },
      });
      if (!role) {
        throw { message: 'role not found', status: HttpStatus.NOT_FOUND };
      }
      return role;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async findAll() {
    return await this.roleRepository.findAll();
  }
}
