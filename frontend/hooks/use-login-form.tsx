"use client";

import { useState, useTransition } from "react";
import { LoginFormData, LoginFormErrors, LoginFormTouched } from "@/types/auth";

type LoginFormField = keyof LoginFormData

export default function useLoginForm(){
    const [formData, setFormData] = useState<LoginFormData>({
        'username': '',
        'password': ''
    });

    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [touched, setTouched] = useState<LoginFormTouched>({});

    const updateField = (field: LoginFormField, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const makeFieldAsTouched = (field: LoginFormField): void => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }))
    }

    const removeFieldFromPreviousError = (field: LoginFormField): void => {
        setErrors(previousErrors => {
            const newErrors = {...previousErrors};
            delete newErrors[field];
            return newErrors;
        })
    }

    const validateForm = (): boolean => {
        const newErros: LoginFormErrors = {};

        if (!formData?.username || formData.username.length === 0) {
            newErros.username = "Username is required!";
        } else {
            removeFieldFromPreviousError("username");
        }

        if (!formData?.password || formData.password.trim().length === 0) {
            newErros.password = "Password is required!";
        } else if (formData.password.length < 8) {
            newErros.password = "Password length must be at least 8 characters!";
        } else {
            removeFieldFromPreviousError("password");
        }

        setErrors(newErros);
        console.log(errors);
        return Object.keys(newErros).length === 0;
    }

    const resetForm = (): void => {
        setFormData({username: "", password: ""});
        setErrors({});
        setTouched({});
    }

    return {
        formData,
        errors,
        touched,
        updateField,
        makeFieldAsTouched,
        validateForm,
        resetForm
    };

}