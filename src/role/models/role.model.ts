import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';

import { User } from '../../user/models/user.model';

interface RoleCreationAttribute {
  role: string;
  role_desc: string;
}

@Table({ tableName: 'role', timestamps: false })
export class Role extends Model<Role, RoleCreationAttribute> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;
  @Column({
    type: DataType.STRING,
  })
  role: string;

  @Column({
    type: DataType.STRING,
  })
  role_desc: string;

  @HasMany(() => User, 'role_id')
  user: User[];
}
