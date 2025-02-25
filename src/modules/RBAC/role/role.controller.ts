import { Controller, Get, Post, Put, Param, Body, ParseIntPipe, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleWithPermissionsDto } from './dto/update-role-with-permissions.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Screen Action')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Post()
  async createRoleWithPermissions(
    @Body() createRoleDto: CreateRoleDto
  ): Promise<Role> {
    return this.roleService.createRoleWithPermissions(createRoleDto);
  }

  @Post(':id')
  async updateRoleWithPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleWithPermissionsDto
  ): Promise<Role> {
    return this.roleService.updateRoleWithPermissions(id, updateRoleDto);
  }

  @Get(':id')
  getRoleById(@Param('id') roleId: number): Promise<Role> {
    return this.roleService.getRoleById(roleId);
  }

  @Post(':id/delete')
  deleteRoleById(@Param('id') roleId: number): Promise<{ message: string }> {
    return this.roleService.deleteRoleById(roleId);
  }

  @Post('activeStatus')
  async updateRoleStatus(
    @Body() body: { id: number; action: 'enable' | 'disable' }
  ): Promise<{ message: string }> {
    return this.roleService.setRoleActiveStatus(body);
  }

}
