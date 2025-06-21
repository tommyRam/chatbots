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

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expire_in: number;
}

export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormDataErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

export interface RegisterFormDataTouched {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}