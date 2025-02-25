import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateRoleDto {
  name?: string;
  description?: string;
  activeFlag?: number;
}