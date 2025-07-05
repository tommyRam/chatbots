"use client";

import Button from "@/ui/reusable_component/button";
import AuthInputForm from "@/ui/reusable_component/auth-input-form";
import Link from "next/link";
import { ChangeEvent, FormEvent, startTransition, useEffect, useState, useTransition } from "react";
import useLoginForm from "@/hooks/use-login-form";
import { AuthResponse } from "@/types/auth";
import { LoginFormData } from "@/types/auth";
import { getCurrentUser, login } from "@/api/auth-api";
import { useRouter } from "next/navigation";
import { getUserChatList } from "@/api/chat-api";
import { Database } from "lucide-react";

type LoginFormField = keyof LoginFormData

export default function Login() {
    const [submittingError, setSubmittingError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();
    const {
        formData,
        errors,
        touched,
        updateField,
        makeFieldAsTouched,
        validateForm,
        resetForm
    } = useLoginForm();


    const handleSubmit = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();
        if (submittingError) {
            setSubmittingError("");
        }

        const isValidForm = validateForm();
        setIsPending(true);
        if (isValidForm) {
            try {
                const response = await login(formData);
                const userData = await getCurrentUser(response.access_token);

                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);
                localStorage.setItem("user_data", JSON.stringify(userData));

                const chatList = await getUserChatList(userData.id, response.access_token);
                localStorage.setItem("chatList", JSON.stringify(chatList));
                router.push("/main/chat/new");
            } catch (e: unknown) {
                setSubmittingError("" + e);
            } finally {
                setIsPending(false);
            }
        } else {
            setIsPending(false);
        }
    }

    const handleInputChange = (field: LoginFormField) => (e: ChangeEvent<HTMLInputElement>): void => {
        updateField(field, e.target.value);
    }

    const handleInputBlur = (field: LoginFormField) => (): void => {
        makeFieldAsTouched(field);
    }

    const shouldShowError = (field: LoginFormField): boolean => {
        return Boolean(errors[field]);
    }

    return (
        <div className="flex-1 bg-white flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
                        <div className="flex w-full items-center justify-center mb-6 font-bold text-xl text-purple-900">Login</div>
                        <div className="space-y-6">
                            <AuthInputForm
                                id="user_id"
                                type="text"
                                label="Username or Email"
                                placeholder="Enter your username or email"
                                shouldShowError={shouldShowError("username")}
                                errorMessage={errors.username}
                                value={formData.username}
                                onChange={handleInputChange("username")}
                                onBlur={handleInputBlur("username")}
                            />

                            <AuthInputForm
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                shouldShowError={shouldShowError("password")}
                                errorMessage={errors.password}
                                value={formData.password}
                                onChange={handleInputChange("password")}
                                onBlur={handleInputBlur("password")}
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
                                    buttonName="Sign In"
                                    actionName="Signing in..."
                                    style="w-full group"
                                    isPending={isPending}
                                    action={handleSubmit}
                                />
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors hover:underline">
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
}