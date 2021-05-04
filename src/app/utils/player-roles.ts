import { Role } from 'dart3-sdk';

export const hasRole = (roles: Role[], role: Role) => {
  if (!roles) {
    return false;
  }

  return roles.includes(role);
};
