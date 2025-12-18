export interface Permission {
  id: string;
  name: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permissionName?: string;
}
