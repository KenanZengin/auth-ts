"use client"

import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {

    const searchParams = useSearchParams();
    const callBackUrl = searchParams.get("callbackurl");
    const onClick = (provider: "google" | "github") =>{
        signIn(provider,{
            callbackUrl: callBackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } 

  return (
    <div className='flex items-center w-full gap-x-2'>
        <Button
            size={"lg"}
            className="w-full"
            variant={"outline"}
            onClick={() => onClick("google")}
        >
            <FcGoogle className="h-5 w-5" />
        </Button>
        <Button
            size={"lg"}
            className="w-full"
            variant={"outline"}
            onClick={() => onClick("github")}
        >
            <FaGithub className="h-5 w-5" />
        </Button>
    </div>
  );
};

export default Social