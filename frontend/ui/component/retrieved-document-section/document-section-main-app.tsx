import DocBody from "./doc-body";
import DocHeader from "./doc-header";

export default function DocumentMain() {

    return (
        <div className="h-full w-full flex flex-col ">
            <div className="border-b-gray-100 border-b">
                <DocHeader />
            </div>
            <div className="flex-1 flex justify-center pt-0.5 overflow-y-auto pretty-scrollbar-minimal">
                <DocBody />
            </div>
        </div>
    )
}