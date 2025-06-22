interface ProfileMenuProps {
    username: string;
}

export default function ProfileMenu(
    {
        username
    }: ProfileMenuProps
) {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <div
                className="flex justify-center items-center border-purple-950 border-2 w-9 h-9 rounded-4xl hover:cursor-pointer bg-purple-900 text-white"
            >
                {username.charAt(0).toUpperCase()}
            </div>
        </div>
    )
}