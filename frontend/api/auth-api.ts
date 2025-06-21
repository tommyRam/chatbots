import { LoginFormData, AuthResponse, RegisterFormData } from "@/types/auth";

export const login = async (loginFormData: LoginFormData): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append("username", loginFormData.username);
    formData.append("password", loginFormData.password);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/app/auth/login",
            {
                method: "POST",
                body: formData
            }
        )
        console.log(response);
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

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/app/register/user",
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json",
                        
                    }
                }
            )
            console.log(response);
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