import HeaderMain from "@/ui/component/header-main-app";
import SideBarMain from "@/ui/component/sidebar-main-app";

export default function Layout ({children}: {children: React.ReactNode}){
    return (
        <div className="flex flex-row h-screen bg-gray-100">
            <SideBarMain />
            <div className="flex-1 flex flex-col">
                <HeaderMain />
                {children}
            </div>
        </div>
    )
}