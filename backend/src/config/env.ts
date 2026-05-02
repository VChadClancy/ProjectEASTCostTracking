// Environment configuration for backend

const allowedRepositoryModes = ['mock', 'prisma'] as const;
type RepositoryMode = typeof allowedRepositoryModes[number];

function parseRepositoryMode(val: any): RepositoryMode {
  if (allowedRepositoryModes.includes(val)) return val;
  return 'mock';
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    NODE_ENV: env.NODE_ENV || 'development',
    PORT: parseInt(env.PORT || '', 10) || 4000,
    API_VERSION: env.API_VERSION || 'v1',
    DATABASE_URL: env.DATABASE_URL || undefined,
    REPOSITORY_MODE: parseRepositoryMode(env.REPOSITORY_MODE),
  };
}

export const config = loadConfig();
