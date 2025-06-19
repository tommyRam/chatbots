interface ButtonProps {
    buttonName: string;
    type?: "button" | "submit" | "reset";
    action?: () => void;
    style?: string;
}

export default function Button({
    buttonName,
    type = "button",
    action,
    style
}: ButtonProps) {
    return (
        <button 
            type={type}
            onClick={action} 
            className={`bg-purple-900 hover:bg-purple-600 hover:shadow-purple-900 hover:cursor-pointer text-white font-bold px-5 py-2 rounded ${style}`}
        >
            {buttonName}
        </button>
    );
}