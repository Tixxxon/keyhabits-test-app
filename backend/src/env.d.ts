declare namespace NodeJS {
  interface ProcessEnv {
    HOST?: string;
    PORT?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
  }
}
