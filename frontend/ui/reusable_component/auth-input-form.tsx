interface AuthInputFormProps {
    type?: "password" | "email" | "text";
    placeholder: string;
    label: string;
}

export default function AuthInputForm({
    type = "text",
    label,
    placeholder
}: AuthInputFormProps) {
    return (
        <div className="flex flex-col">
            <label className="text-gray-600 font-semibold text-lg">{label}</label>
            <input 
                type={type}
                placeholder={placeholder}
                className="border-gray-500 border-2 rounded h-10 px-3 text-purple-950 placeholder:text-gray-500" 
            ></input>
        </div>
    )
}