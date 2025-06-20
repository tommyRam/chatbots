export interface LoginFormData {
    username: string;
    password: string;
}

export interface LoginFormErrors {
    username?: string;
    password?: string
}

export interface LoginFormTouched {
    username?: boolean;
    password?: boolean;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expire_in: number;
}