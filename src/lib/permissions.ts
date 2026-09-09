export const canCreateProject = (role: string) => {
  return ["owner", "admin", "manager"].includes(role);
};

export const canEditProject = (role: string) => {
  return ["owner", "admin", "manager"].includes(role);
};

export const canDeleteProject = (role: string) => {
  return ["owner", "admin"].includes(role);
};

export const canCreateTask = (role: string) => {
  return ["owner", "admin", "manager", "developer"].includes(role);
};

export const canEditTask = (role: string) => {
  return ["owner", "admin", "manager", "developer"].includes(role);
};

export const canDeleteTask = (role: string) => {
  return ["owner", "admin", "manager"].includes(role);
};

export const formatRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const canManageMembers = (role: string) => {
  return ["owner", "admin"].includes(role);
};