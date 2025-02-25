export class UpdateRolePermissionsDto {
    permissions: {
      id?: number; 
      screenId: number;
      actionIds: string[]; 
    }[];
  }
  