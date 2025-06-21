import { LoginFormData, AuthResponse, RegisterFormData, UserResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (loginFormData: LoginFormData): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append("username", loginFormData.username);
    formData.append("password", loginFormData.password);
    
    const LOGIN_URL = API_URL + "/api/app/auth/login";

    try {
        const response = await fetch(
            LOGIN_URL,
            {
                method: "POST",
                body: formData
            }
        )
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e) {
        console.error(e)
        throw e;
    }
}

export const register = async (registerFormData: RegisterFormData): Promise<AuthResponse> => {
    const formData = {
        "email": registerFormData.email,
        "username": registerFormData.username,
        "password": registerFormData.password
    }
    const REGISTER_URL = API_URL + "/api/app/register/user";

    try {
        const response = await fetch(
            REGISTER_URL,
            {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                    
                }
            }
        )
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e) {
        console.error(e)
        throw e;
    }
}

export const getCurrentUser = async (access_token: string): Promise<UserResponse> => {
    const CURRENT_USER_URL = API_URL + "/api/app/auth/current-user";

    try {
        const response = await fetch(
            CURRENT_USER_URL,
            {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                }
            }
        );
        console.log(response);
        if(!response.ok){
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        return await response.json();
    }catch(e){
        console.error(e);
        throw e;
    }
}