import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UpdateRoleWithPermissionsDto } from './dto/update-role-with-permissions.dto';
import { Module as MenuModule } from '../menu-creator/entities/module.entity';
import { Screen } from '../menu-creator/entities/screen.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(MenuModule)
    private readonly menuModuleRepository: Repository<MenuModule>,
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
  ) {}

  async createRoleWithPermissions(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description, permissions } = createRoleDto;

    const role = this.roleRepository.create({
      name,
      description,
      activeFlag: 1,
    });

    const savedRole = await this.roleRepository.save(role);

    for (const permission of permissions) {
      const rolePermission = this.rolePermissionRepository.create({
        role: savedRole,
        screenId: permission.screenId,
        actionIds: permission.actionIds,
      });

      await this.rolePermissionRepository.save(rolePermission);
    }

    return savedRole;
  }

  async updateRoleWithPermissions(
    roleId: number,
    updateRoleDto: UpdateRoleWithPermissionsDto,
  ): Promise<Role> {
    const { name, description, permissions } = updateRoleDto;

    // Find the role by ID
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Update the role properties if provided
    if (name !== undefined) {
      role.name = name;
    }
    if (description !== undefined) {
      role.description = description;
    }
    if (updateRoleDto.activeFlag !== undefined) {
      role.activeFlag = updateRoleDto.activeFlag;
    }

    // Save the updated role
    const updatedRole = await this.roleRepository.save(role);

    // Remove all existing permissions for the role
    await this.rolePermissionRepository.delete({ role: { id: roleId } });

    // Re-create permissions with the new data
    for (const permission of permissions) {
      const rolePermission = this.rolePermissionRepository.create({
        role: updatedRole,
        screenId: permission.screenId,
        actionIds: permission.actionIds,
      });
      await this.rolePermissionRepository.save(rolePermission);
    }

    return updatedRole;
  }

  async getRoleById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    role.permissions = await this.rolePermissionRepository.find({
      where: { role: { id: roleId } },
      relations: ['screen'],
    });
    return role;
  }

  async deleteRoleById(roleId: number): Promise<{ message: string }> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    role.activeFlag = 0;
    await this.roleRepository.save(role);
    return {
      message: `Role with ID ${roleId} has been successfully deactivated.`,
    };
  }

  async setRoleActiveStatus(body: {
    id: number;
    action: 'enable' | 'disable';
  }): Promise<{ message: string }> {
    const { id, action } = body;
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    if (!action) {
      throw new NotFoundException(`Action parameter is required`);
    }
    role.activeFlag = action === 'enable' ? 1 : 0;
    await this.roleRepository.save(role);
    const actionVerb = action === 'enable' ? 'enabled' : 'disabled';
    return {
      message: `Role with ID ${id} has been successfully ${actionVerb}.`,
    };
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['permissions'],
    });
  }
}
