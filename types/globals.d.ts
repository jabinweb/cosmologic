/// <reference types="node" />

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface GoogleButtonConfig {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill';
  width?: number;
}

export interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
  ux_mode?: 'popup' | 'redirect';
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

export interface GoogleNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getMomentType: () => string;
}

export interface GoogleAccountsId {
  initialize: (config: GoogleInitializeConfig) => void;
  prompt: (momentListener?: (notification: GoogleNotification) => void) => void;
  renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
  cancel: () => void;
}

export interface GoogleTokenPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  sub: string;
}

export interface GoogleTokens {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

interface GoogleInitConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
  context?: 'signin' | 'signup';
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  ux_mode?: 'popup' | 'redirect';
  itp_support?: boolean;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
      NEXT_PUBLIC_APP_URL: string;
      JWT_SECRET: string;
    }
  }

  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with';
              shape?: 'rectangular' | 'pill';
              width?: number;
            }
          ) => void;
          prompt: (callback?: (notification: GoogleNotification) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export {};
