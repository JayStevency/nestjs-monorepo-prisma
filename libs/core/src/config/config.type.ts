export type ConfigProps = {
  environment: string;
  appName: string | undefined;
  version: string | undefined;
  databaseUrl?: string;
  prismaLogger?: string;
};
