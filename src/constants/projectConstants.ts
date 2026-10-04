export const ProjectStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ProjectVisibility = {
  PUBLIC: 'PUBLIC',
  CLOSED: 'CLOSED',
} as const;

export type ProjectVisibility = typeof ProjectVisibility[keyof typeof ProjectVisibility];
