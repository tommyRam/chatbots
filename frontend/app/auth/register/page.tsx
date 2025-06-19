import Button from "@/ui/reusable_component/button";
import AuthInputForm from "@/ui/reusable_component/auth-input-form";
import Link from "next/link";

export default function Register(){
    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col px-9 py-9 rounded border-2 border-gray-500  w-[30%]">
                <div className="w-full text-4xl font-bold text-purple-950 flex justify-center pb-3">
                    Register
                </div>
                <div>
                    <form className="space-y-4">
                        <AuthInputForm 
                            type="email"
                            label="Email"
                            placeholder="user@gmail.com"
                        />
                        <AuthInputForm 
                            type="text"
                            label="Username"
                            placeholder="username"
                        />
                        <AuthInputForm 
                            type="password"
                            label="Password"
                            placeholder="Password"
                        />
                        <AuthInputForm 
                            type="password"
                            label="Confirm password"
                            placeholder="Confirm password"
                        />
                        <div className="flex justify-center pt-1.5">
                            <Button type="submit" buttonName="Submit" style="w-full"/>
                        </div>
                    </form>
                </div>
                <div>
                    <Link href={"/auth/login"}>
                        <div 
                            className="flex justify-center pt-6 text-blue-400 hover:cursor-pointer"
                        >
                            Already have an account ?
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}