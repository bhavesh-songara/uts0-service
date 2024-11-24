import config from "../../config";

export const GOOGLE_AUTH_CALLBACK_URL = `${config.serviceUrl}/api/auth/google/callback`;
export const GOOGLE_AUTH_SUCCESS_REDIRECT_URL = `${config.appUrl}/dashboard`;
export const GOOGLE_AUTH_FAILURE_REDIRECT_URL = `${config.appUrl}`;
