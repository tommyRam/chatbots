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
        <div className="relative flex-1" ref={profileRef}>
            <div
                onClick={() => setShowProfileModal(!showProfileModal)}
                className={`flex justify-center items-center border-purple-950 hover:border-white border-2 rounded-4xl hover:cursor-pointer bg-purple-50 hover:bg-purple-800 text-purple-950 hover:text-white font-bold ${style ? style : "w-9 h-9"}`}
            >
                {userData && userData.username.charAt(0).toUpperCase()}
            </div>
            {
                showProfileModal && userData && (
                    <div className="absolute right-0 top-10 flex flex-col gap-y-3 bg-white border border-gray-300 rounded-xl shadow-lg px-1.5 py-3 z-11">
                        <div className="flex items-center justify-start gap-x-2 px-2 py-1 rounded-md">
                            <UserCircle2 className="w-5 h-5 text-gray-500"/>
                            <div className="text-gray-500">{userData.email}</div>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <hr className="mt-1 text-gray-500"/>
                            <div 
                                onClick={handleLogout}
                                className="flex items-center justify-start gap-x-2 hover:cursor-pointer hover:bg-gray-200 px-2 py-1  rounded-md">
                                <LogOutIcon className="w-5 h-5 text-gray-500" />
                                <div className="text-gray-500">Log out</div>
                            </div>                            
                        </div>
                    </div>
                )
            }
        </div>
    )
}