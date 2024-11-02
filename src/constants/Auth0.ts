import config from "../../config";

export const AUTH0_BASE_URL = `${config.baseUrl}/api/auth`;
export const AUTH0_CALLBACK_URL = `${config.baseUrl}/api/auth/callback`;
export const AUTH0_LOGIN_SUCCESS_URL = `${config.appUrl}/dashboard`;
export const AUTH0_LOGOUT_URL = `${config.appUrl}`;
