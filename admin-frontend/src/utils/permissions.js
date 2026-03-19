export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  const permissions = {
    super_admin: '*',
    admin: [
      'users.view',
      'users.edit',
      'bookings.view',
      'bookings.edit',
      'tours.view',
      'tours.edit',
      'payments.view',
      'reports.view',
    ],
    user: [
      'profile.view',
      'profile.edit',
      'bookings.view.own',
    ],
  };

  if (user.role === 'super_admin') return true;
  
  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes(permission);
};

export const canView = (user, resource) => {
  return hasPermission(user, `${resource}.view`);
};

export const canEdit = (user, resource) => {
  return hasPermission(user, `${resource}.edit`);
};

export const canDelete = (user, resource) => {
  return hasPermission(user, `${resource}.delete`);
};

export const canCreate = (user, resource) => {
  return hasPermission(user, `${resource}.create`);
};