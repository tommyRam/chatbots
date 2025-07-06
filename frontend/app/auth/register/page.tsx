"use client";

import Button from "@/ui/reusable_component/button";
import AuthInputForm from "@/ui/reusable_component/auth-input-form";
import Link from "next/link";
import UseRegisterForm from "@/hooks/use-register-form";
import { ChangeEvent, useState, FormEvent } from "react";
import { RegisterFormData } from "@/types/auth";
import { getCurrentUser, register } from "@/api/auth-api";
import { useRouter } from "next/navigation";
import { getUserChatList } from "@/api/chat-api";

type RegisterFormDataField = keyof RegisterFormData;

export default function Register() {
    const [submittingError, setSubmittingError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const {
        formData,
        errors,
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

        if (submittingError) {
            setSubmittingError("");
            setIsPending(false);
        }

        const isValidRegisterForm = validateRegisterForm();
        if (isValidRegisterForm) {
            try {
                const response = await register(formData);
                const userData = await getCurrentUser(response.access_token);

                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);
                localStorage.setItem("user_data", JSON.stringify(userData));

                const chatList = await getUserChatList(userData.id, response.access_token);
                localStorage.setItem("chatList", JSON.stringify(chatList));
                router.push("/main/chat/new");
            } catch (e: unknown) {
                setSubmittingError("" + JSON.stringify(e));
            } finally {
                setIsPending(false);
            }
        } else {
            setIsPending(false);
        }
    }

    const handleInputChange = (field: RegisterFormDataField) => (e: ChangeEvent<HTMLInputElement>): void => {
        updateRegisterFormField(field, e.target.value);
    }

    const handleInputBlur = (field: RegisterFormDataField) => (): void => {
        makeRegisterFormFieldAsTouched(field);
    }

    const shouldShowError = (field: RegisterFormDataField): boolean => {
        return (errors[field] ? true : false);
    }

    return (
        <div className="flex-1 flex bg-white items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
            </div>
            <div className="relative w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="flex w-full items-center justify-center mb-6 font-bold text-xl text-purple-900">Create account</div>
                        <div className="space-y-5">
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
                                label="Confirm Password"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                errorMessage={errors.confirmPassword}
                                onChange={handleInputChange("confirmPassword")}
                                onBlur={handleInputBlur("confirmPassword")}
                                shouldShowError={shouldShowError("confirmPassword")}
                            />

                            {submittingError && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">!</span>
                                        </div>
                                        <span className="text-red-700 text-sm font-medium">
                                            {submittingError}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    buttonName="Create Account"
                                    actionName="Creating account..."
                                    style="w-full group"
                                    isPending={isPending}
                                    action={handleSubmit}
                                />
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
}