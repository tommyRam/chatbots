import Button from "@/ui/reusable_component/button";
import AuthInputForm from "@/ui/reusable_component/auth-input-form";
import Link from "next/link";

export default function Login(){
    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col px-9 py-9 rounded border-2 border-gray-500  w-[27%]">
                <div className="w-full text-4xl font-bold text-purple-950 flex justify-center pb-12 w-">
                    Login
                </div>
                <div>
                    <form className="space-y-4">
                        <AuthInputForm 
                            type="text"
                            label="Username or email"
                            placeholder="Username or email"
                        />
                        <AuthInputForm 
                            type="password"
                            label="Password"
                            placeholder="Password"
                        />
                        <div className="flex justify-center pt-2">
                            <Button type="submit" buttonName="Login" style="w-full"/>
                        </div>
                    </form>
                </div>
                <div>
                    <Link href={"/auth/register"}>
                        <div 
                            className="flex justify-center pt-6 text-blue-400 hover:cursor-pointer"
                        >
                            Create an account ?
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}