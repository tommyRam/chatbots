interface ProfileMenuProps {
    username: string;
    style?: string;
}

export default function ProfileMenu(
    {
        username,
        style
    }: ProfileMenuProps
) {
    return (
        <div className="flex-1">
            <div
                    className={`flex justify-center items-center border-purple-950 border-2 rounded-4xl hover:cursor-pointer bg-purple-50 text-purple-950 font-bold ${style ? style : "w-9 h-9"}`}
            >
                {username.charAt(0).toUpperCase()}
            </div>
        </div>
    )
}