import { config } from '.';

export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
} as const;