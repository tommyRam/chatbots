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
    type = "button",
    isPending,
    style,
    action
}: ButtonProps) {
    return (
        <button
            disabled={isPending}
            type={type}
            onClick={action}
            className={`bg-purple-900 hover:bg-purple-600 hover:shadow-purple-900 hover:cursor-pointer text-white font-bold px-5 py-2 rounded ${style}`}
        >
            {
                isPending ? (
                    <div className="flex item-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {actionName}
                    </div>
                ) : buttonName
            }
        </button>
    );
}