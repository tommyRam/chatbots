"use client";

import Button from "@/ui/reusable_component/button";
import AuthInputForm from "@/ui/reusable_component/auth-input-form";
import Link from "next/link";
import UseRegisterForm from "@/hooks/use-register-form";
import { ChangeEvent, useTransition, useState, FormEvent, startTransition } from "react";
import { RegisterFormData } from "@/types/auth";
import { getCurrentUser, register } from "@/api/auth-api";
import { useRouter } from "next/navigation";
import { getUserChatList } from "@/api/chat-api";

type RegisterFormDataField = keyof RegisterFormData;

export default function Register(){
    const [submittingError, setSubmittingError]= useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const {
        formData,
        errors,
        formTouched,
        updateRegisterFormField,
        makeRegisterFormFieldAsTouched,
        validateRegisterForm
    } = UseRegisterForm();

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();
        setIsPending(true);
        console.log("validate");
        console.log("formdata: " + JSON.stringify(formData));

        if(submittingError){
            setSubmittingError("");
            setIsPending(false);
        }

        const isValidRegisterForm = validateRegisterForm();
        if (isValidRegisterForm){
                try {
                    const response = await register(formData);
                    const userData = await getCurrentUser(response.access_token);

                    localStorage.setItem("access_token", response.access_token);
                    localStorage.setItem("refresh_token", response.refresh_token);
                    localStorage.setItem("user_data", JSON.stringify(userData));

                    const chatList = await getUserChatList(userData.id, response.access_token);
                    localStorage.setItem("chatList", JSON.stringify(chatList));
                    router.push("/main/chat/new");
                } catch(e: unknown){
                    setSubmittingError("" + JSON.stringify(e));
                } finally {
                    setIsPending(false);
                }  
        }
    }

    const handleInputChange = (field: RegisterFormDataField) => (e: ChangeEvent<HTMLInputElement>): void => {
        updateRegisterFormField(field, e.target.value);
    }

    const handleInputBlur = (field: RegisterFormDataField) => (): void => {
        makeRegisterFormFieldAsTouched(field);
    }

    const shouldShowError = (field: RegisterFormDataField): boolean => {
        return  (errors[field] ? true : false);
    }

    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col px-9 py-9 rounded border-2 border-gray-500  w-[30%]">
                <div className="w-full text-4xl font-bold text-purple-950 flex justify-center pb-3">
                    Register
                </div>
                <div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <AuthInputForm 
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="user@gmail.com"
                            value={formData.email}
                            errorMessage={errors.email}
                            autofocus={true}
                            onChange={handleInputChange("email")}
                            onBlur={handleInputBlur("email")}
                            shouldShowError={shouldShowError("email")}
                        />
                        <AuthInputForm 
                            id="username"
                            type="text"
                            label="Username"
                            placeholder="username"
                            value={formData.username}
                            errorMessage={errors.username}
                            onChange={handleInputChange("username")}
                            onBlur={handleInputBlur("username")}
                            shouldShowError={shouldShowError("username")}
                        />
                        <AuthInputForm 
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            value={formData.password}
                            errorMessage={errors.password}
                            onChange={handleInputChange("password")}
                            onBlur={handleInputBlur("password")}
                            shouldShowError={shouldShowError("password")}
                        />
                        <AuthInputForm 
                            id="confirmPassword"
                            type="password"
                            label="Confirm password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            errorMessage={errors.confirmPassword}
                            onChange={handleInputChange("confirmPassword")}
                            onBlur={handleInputBlur("confirmPassword")}
                            shouldShowError={shouldShowError("confirmPassword")}
                        />

                        {
                            submittingError && 
                            <div className="text-red-400 text-sm">
                                {submittingError}
                            </div>
                        }

                        <div className="flex justify-center pt-1.5">
                            <Button 
                                type="submit" 
                                buttonName="Register" 
                                style="w-full"
                                actionName="Register..."
                                isPending={isPending}
                                action={handleSubmit}
                            />
                        </div>
                    </form>
                </div>
                <div>
                    <Link href={"/auth/login"}>
                        <div 
                            className="flex justify-center pt-6 text-blue-400 hover:cursor-pointer"
                        >
                            Already have an account ?
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}