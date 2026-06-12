declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_API_URL?: string;
    readonly EXPO_PUBLIC_APP_ENV?: string;
    readonly NODE_ENV?: 'development' | 'production' | 'test';
  }

  interface Process {
    readonly env: ProcessEnv;
  }
}

declare let process: NodeJS.Process;
