"use client";

import { useState } from "react";
import { RegisterFormData, RegisterFormDataErrors, RegisterFormDataTouched } from "@/types/auth";
import { checkEmail } from "@/utils/auth";

type RegisterFormDataField = keyof RegisterFormData;

export default function UseRegisterForm() {
    const [formData, setFormData] = useState<RegisterFormData>({
        "email": "",
        "username": "",
        "password": "",
        "confirmPassword": ""
    });
    const [errors, setErrors] = useState<RegisterFormDataErrors>({});
    const [formTouched, setFormTouched] = useState<RegisterFormDataTouched>({})

    const updateRegisterFormField = (field: RegisterFormDataField, value: string): void => {
        setFormData(previousFormData => ({
            ...previousFormData,
            [field]: value
        }));
    }

    const removeFieldFromPreviousError = (field: RegisterFormDataField): void => {
        setErrors(previousErrorsObject => ({
            ...previousErrorsObject,
            [field]: undefined
        }));
    }

    const makeRegisterFormFieldAsTouched = (field: RegisterFormDataField): void => {
        setFormTouched(previousFieldTouched => ({
            ...previousFieldTouched,
            [field]: true
        }));
    }

    const validateRegisterForm = (): boolean => {
        const newErros: RegisterFormDataErrors = {};

        if(!formData?.email || formData?.email?.trim().length === 0){
            newErros.email = "The email field is required!";
        }else if (!checkEmail(formData.email)){
            newErros.email = "Email invalid!"
        }else {
            removeFieldFromPreviousError("email");
        }

        if(!formData?.username || formData?.username?.trim().length === 0){
            newErros.username = "The username field is required!"
        }else {
            removeFieldFromPreviousError("username");
        }

        if(!formData?.password || formData?.password?.trim().length === 0){
            newErros.password = "The password field is required!";
        }else {
            removeFieldFromPreviousError("password");
        }

        if(!formData?.confirmPassword || formData?.confirmPassword.trim().length === 0){
            newErros.confirmPassword = "The confirm password field is required!"
        }else if (formData.confirmPassword !== formData.password){
            newErros.confirmPassword = "The confirm password must match with the password";
        }else {
            removeFieldFromPreviousError("confirmPassword");
        }

        setErrors(newErros);
        return Object.keys(newErros).length === 0;
    }

    return {
        formData,
        errors,
        formTouched,
        updateRegisterFormField,
        makeRegisterFormFieldAsTouched,
        validateRegisterForm
    }
}