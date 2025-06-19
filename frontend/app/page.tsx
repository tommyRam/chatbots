"use client";

import Link from "next/link";
import Button from "@/ui/reusable_component/button";
import LandingPageHeader from "@/ui/component/landing-page-header";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <LandingPageHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center space-y-7">
        <div>
          <p className="text-3xl font-bold">
            Welcome to RAnGo app where you can test the best RAG for your application
          </p>
        </div>
        <div className="space-x-2.5">
          <Link href={"/auth/login"}>
            <Button buttonName="Login" />
          </Link>
          <Link href={"/auth/register" }>
            <Button buttonName="Register" />
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
