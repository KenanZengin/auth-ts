
import React from 'react'
import { CardWrapper } from "./card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorCard = () => {
  return (
   <CardWrapper
        headerLabel="Oops! Soemthing went wrong"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
   >
        <div className="w-full flex justiny-center items-center">
            <ExclamationTriangleIcon className="text-destructive" />
        </div>
   </CardWrapper>
  )
}

export default ErrorCard