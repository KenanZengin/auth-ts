"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogTrigger,DialogContent } from "../ui/dialog";
import { LoginForm } from "./login-form";

interface LoginButtonProps{
    children: React.ReactNode,
    mode?: "modal" | "redirect",
    asChild?: boolean,
};

export const LoginButton = ({
    children,
    mode = "redirect", // bir şey yollamazsak default olarak redirect yapıyoruz modu
    asChild
}:LoginButtonProps) => {

    const router = useRouter();

    const onClick = () => {
       router.push(
        "/auth/login"
       );
    }

    if(mode === "modal"){
        return(
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 border-none w-auto">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        )
    }


    return(
        <span className="cursor-pointer" onClick={onClick}>
            {children}
        </span>
    )
}