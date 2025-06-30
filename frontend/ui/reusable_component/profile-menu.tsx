"use client";

import { UserResponse } from "@/types/auth";
import { clearLocalStorage } from "@/utils/auth";
import { LogOutIcon, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface ProfileMenuProps {
    userData: UserResponse | null;
    style?: string;
}

export default function ProfileMenu(
    {
        userData,
        style
    }: ProfileMenuProps
) {
    const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileModal(false);
            }
        }

        if (showProfileModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileModal]);

    const handleLogout = (): void => {
        clearLocalStorage();
        router.push("/auth/login");
    }

    return (
        <div className="flex-1" ref={profileRef}>
            <div
                onClick={() => setShowProfileModal(!showProfileModal)}
                className={`flex justify-center items-center border-purple-950 hover:border-white border-2 rounded-4xl hover:cursor-pointer bg-purple-50 hover:bg-purple-800 text-purple-950 hover:text-white font-bold ${style ? style : "w-9 h-9"}`}
            >
                {userData && userData.username.charAt(0).toUpperCase()}
            </div>
            {
                showProfileModal && userData && (
                    <div className="absolute right-12 top-12 flex flex-col gap-y-3 bg-purple-600 py-2 px-4 rounded-xl  z-11">
                        <div className="flex items-center justify-start gap-x-2 px-2 py-1 rounded-md">
                            <UserCircle2 className="w-5 h-5 text-white"/>
                            <div className="text-white">{userData.email}</div>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <hr className="mt-1 text-white"/>
                            <div 
                                onClick={handleLogout}
                                className="flex items-center justify-start gap-x-2 hover:cursor-pointer hover:bg-purple-500 px-2 py-1 rounded-md">
                                <LogOutIcon className="w-5 h-5 text-white" />
                                <div className="text-white">Log out</div>
                            </div>                            
                        </div>
                    </div>
                )
            }
        </div>
    )
}