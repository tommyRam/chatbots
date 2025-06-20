"use client";

import Button from "@/ui/reusable_component/button";
import AuthInputForm from "@/ui/reusable_component/auth-input-form";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState, useTransition } from "react";
import useLoginForm from "@/hooks/use-login-form";
import { LoginResponse } from "@/types/auth";
import { LoginFormData } from "@/types/auth";

type LoginFormField = keyof LoginFormData

export default function Login(){
    const [submittingError, setSubmittingError]= useState<string>("");
    const [isPending, setStartTransistion] = useTransition();
    const {
        formData,
        errors,
        touched,
        updateField,
        makeFieldAsTouched,
        validateForm,
        resetForm
    } = useLoginForm();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        validateForm();
    }

    const handleUsernameInputField = (e: ChangeEvent<HTMLInputElement>): void => {
        updateField("username", e.target.value);
    }

    const handlePasswordInputField = (e: ChangeEvent<HTMLInputElement>): void => {
        updateField("password", e.target.value);
    }

    const handleUsernameBlur = (): void => {
        makeFieldAsTouched("username");
    }

    const handlePasswordBlur = (): void => {
        makeFieldAsTouched("password");
    }

    const shouldShowError = (field: LoginFormField): boolean => {
        return Boolean(errors[field]);
    }

    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col px-9 py-9 rounded border-2 border-gray-500  w-[27%]">
                <div className="w-full text-4xl font-bold text-purple-950 flex justify-center pb-12 w-">
                    Login
                </div>
                <div>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <AuthInputForm 
                            id="user_id"
                            type="text"
                            label="Username or email"
                            placeholder="Username or email"
                            shouldShowError={shouldShowError("username")}
                            errorMessage={errors.username}
                            value={formData.username}
                            onChange={handleUsernameInputField}
                            onBlur={handleUsernameBlur}
                        />
                        <AuthInputForm 
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            shouldShowError={shouldShowError("password")}
                            errorMessage={errors.password}
                            value={formData.password}
                            onChange={handlePasswordInputField}
                            onBlur={handlePasswordBlur}
                        />
                        <div className="flex justify-center pt-2">
                            <Button type="submit" buttonName="Login" style="w-full"/>
                        </div>
                    </form>
                </div>
                <div>
                    <Link href={"/auth/register"}>
                        <div 
                            className="flex justify-center pt-6 text-blue-400 hover:cursor-pointer"
                        >
                            Create an account ?
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}