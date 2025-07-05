import { ArrowRight } from "lucide-react";
import { FormEvent } from "react";

interface ButtonProps {
    buttonName: string;
    actionName: string;
    type?: "button" | "submit" | "reset";
    isPending?: boolean;
    style?: string;
    action?: (e: FormEvent<HTMLElement>) => Promise<void>;
}

export default function Button({
    buttonName,
    actionName,
    style = "",
    isPending = false,
    type = "button",
    action
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={action}
            disabled={isPending}
            className={`
                relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 
                text-white font-semibold py-3 px-8 rounded-xl
                transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                focus:outline-none focus:ring-4 focus:ring-purple-200
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                ${style}
            `}
        >
            <div className="flex items-center justify-center space-x-2">
                {isPending ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{actionName}</span>
                    </>
                ) : (
                    <>
                        <span>{buttonName}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </div>
        </button>
    );
};