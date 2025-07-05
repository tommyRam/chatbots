import LandingPageHeader from "@/ui/component/landing-page-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex flex-col justify-center bg-white">
            <LandingPageHeader />
            <div className="flex-1 flex bg-white">
                {children}
            </div>
        </div>
    )
}