"use client"

import { newVerification } from "@/actions/new-verification"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { CardWrapper } from './card-wrapper'
import {BeatLoader} from "react-spinners"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

const NewVerificationForm = () => {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(()=>{
       if(!token){
            setError("Missing Token")
            return null
       }
       newVerification(token)
        .then((data)=>{
            setSuccess(data.success);
            setError(data.error);
        })
        .catch(()=>{setError("Something went error")}) 
    },[token])

    useEffect(()=>{
        onSubmit();
    },[onSubmit])

    return (
    <CardWrapper
        headerLabel='Confirming your verification'
        backButtonLabel='back to login'
        backButtonHref='/auth/login'
    >

        <div className="flex items-center w-full justify-center">
            {!success && !error &&(
                <BeatLoader />
            )}
            
            <FormSuccess message={success} />
            <FormError message={error} />
        </div>

    </CardWrapper>
    )
}

export default NewVerificationForm