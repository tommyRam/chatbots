import { LoginFormData, LoginResponse } from "@/types/auth";

export const login = async (loginFormData: LoginFormData): Promise<LoginResponse> => {
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