"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Database, ArrowRight, User, Lock } from "lucide-react";

interface AuthInputFormProps {
    id: string;
    value: string;
    type?: "password" | "email" | "text";
    placeholder: string;
    label: string;
    shouldShowError: boolean;
    errorMessage?: string;
    autofocus?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

const AuthInputForm = ({
    id,
    type = "text",
    label,
    placeholder,
    shouldShowError,
    errorMessage,
    autofocus,
    value,
    onChange,
    onBlur
}: AuthInputFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const getIcon = () => {
        if (type === "password") return <Lock className="w-5 h-5" />;
        if (type === "email" || id === "user_id") return <User className="w-5 h-5" />;
        return <User className="w-5 h-5" />;
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-semibold text-sm tracking-wide">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {getIcon()}
                </div>
                <input
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur();
                    }}
                    onFocus={() => setIsFocused(true)}
                    autoFocus={autofocus}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 
                        transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-100
                        ${shouldShowError
                            ? 'border-red-400 focus:border-red-500'
                            : isFocused
                                ? 'border-purple-500 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {shouldShowError && errorMessage && (
                <div className="text-red-500 text-sm font-medium animate-fade-in">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default AuthInputForm;