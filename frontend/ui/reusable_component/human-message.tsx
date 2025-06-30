import ProfileMenu from "./profile-menu";

interface HumanMessageProps {
    humanMessage: HumanMessageResponseSchema;
    handleClickHumanMessage: (humanMessage: HumanMessageResponseSchema) => void;
}

export default function HumanMessage({humanMessage, handleClickHumanMessage}: HumanMessageProps) {
    return (
        <div className="flex justify-end mb-4">
            <div className="max-w-[85%] group">
                <div className="flex items-start justify-end mb-2">
                <div className="mr-3">
                    <div className="text-xs text-purple-600 font-medium mb-1 text-right">You</div>
                    <div 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-2xl rounded-tr-md shadow-lg hover:shadow-xl transition-all duration-200  hover:cursor-pointer hover:from-purple-700 hover:to-purple-800"
                    onClick={() => handleClickHumanMessage(humanMessage)}
                    >
                    <div className="font-medium leading-relaxed">
                        {humanMessage.content}
                    </div>
                    </div>
                </div>
                <div className={`flex justify-center items-center border-white border-2 rounded-4xl  bg-purple-800 text-white w-8 h-8`}>
                    {"john".charAt(0).toUpperCase()}
                </div>
                </div>
            </div>
        </div>
    )
}