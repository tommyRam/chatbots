export default function DocHeader() {
    return (
        <div className="h-10 flex justify-start items-center">
            <div className={`h-full flex items-center justify-center border-y-4 px-1 border-white hover:cursor-pointer text-gray-800`}>Retrieved documents</div>
            <div className={`h-full flex items-center justify-center border-y-4 border-white px-1 hover:cursor-pointer text-gray-800`}>Original documents</div>
            <div className={`h-full flex items-center justify-center border-y-4 border-white px-1 hover:cursor-pointer text-gray-800`}>Code</div>
        </div>
    )
}