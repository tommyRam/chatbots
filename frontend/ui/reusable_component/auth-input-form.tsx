import { ChangeEvent } from "react";

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

export default function AuthInputForm({
    id,
    type = "text",
    label,
    placeholder,
    shouldShowError,
    errorMessage,
    autofocus,
    onChange,
    onBlur
}: AuthInputFormProps) {
    return (
        <div className="flex flex-col">
            <label className="text-gray-600 font-semibold text-lg">{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                autoFocus={autofocus}
                className={`border-2 rounded h-10 px-3 text-purple-950 placeholder:text-gray-500 focus:outline-none focus:ring-0.5 ${shouldShowError ? 'border-red-400 focus:border-red-400' : 'border-gray-500 focus:border-purple-900'
                    }`}
            ></input>
            {
                shouldShowError &&
                errorMessage &&
                <div className="text-red-400 text-sm">
                    {errorMessage}
                </div>
            }
        </div>
    )
}