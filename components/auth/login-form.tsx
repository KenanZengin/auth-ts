"use client"

import { useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/actions/login"
import { CardWrapper } from "./card-wrapper"
import { LoginSchema } from "@/schemas"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import Link from "next/link"


export const LoginForm = () => {

    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Eamil already in use with different provider" : "";
    const callBackUrl = searchParams.get("callbackurl");

    const [isPending,startTransition] = useTransition();

    const [showTwoFactor, setShowTwoFactor] = useState<boolean | undefined>(false);
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("");
    
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {

        setError("");
        setSuccess("");

        startTransition(()=>{
            login(values,callBackUrl)
                .then((data)=>{
                    if(data?.error){
                        form.reset();
                        setError(data.error)
                    }
                   if(data?.success){
                    form.reset();
                    setSuccess(data.success)
                    }
                    if(data?.twoFactor){
                        setShowTwoFactor(true);
                    }
                })
                .catch(()=>setError("something went wront"));
            }
        );
    };

    return(
        <CardWrapper
            headerLabel="Welcome Back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    
                >
                    <div className="space-y-4">
                       {showTwoFactor &&(
                        <FormField
                        control={form.control}
                        name="code"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Two Factor Code
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isPending}
                                        {...field}
                                        placeholder="123456"                                        
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                       )}
                       {!showTwoFactor && (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isPending}
                                                {...field}
                                                placeholder="test@example.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isPending}
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                            />
                                        </FormControl>
                                        <Button
                                            size={"sm"}
                                            variant={"link"}
                                            asChild
                                            className="px-0 font-normal"
                                        >
                                            <Link href={"/auth/reset"}>
                                                Forgot password?
                                            </Link>
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                       )}
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}