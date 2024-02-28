"use server"

import { db } from "@/lib/db";
import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateTwoFactorToken, generateVerificationToken } from "@/data/tokens";
import { getUserByEamil } from "@/data/user";
import { sendTwoFactorEmail, sendVerificationEamil } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export const login = async (
    values:z.infer<typeof LoginSchema>,
    callbackurl?: string | null
) => {
    
    const validatedFields = LoginSchema.safeParse(values);
    
    if(!validatedFields.success){
        return {error : "Invalid fields"};
    }

   const {email,password, code} = validatedFields.data;

   const existingUser = await getUserByEamil(email);
   console.log("existinguser",existingUser);
   
   if(!existingUser || !existingUser.email || !existingUser.password){
        return {error : "Email is not existing"}
   }
   if(!existingUser.emailVerified){
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEamil(
        verificationToken.email,
        verificationToken.token
    )

    return {success : "Confirmation email sent!"};
   }


   if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(code){

            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken){
                return {error: "Invalid code1!"}
            }
            if(twoFactorToken.token !== code){
                return {error: "Invalid code2"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired){
                return {error: "Code expired3"}
            }

            await db.twoFactorToken.delete({
                where:{
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await db.twoFactorConfirmatoin.delete({
                    where:{
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmatoin.create({
                data:{
                    userId: existingUser.id,
                }
            })

        }else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );

            return {twoFactor: true}
        }
    }

   

  

   try {
        await signIn("credentials",{
            email,
            password,
            redirectTo: callbackurl || DEFAULT_LOGIN_REDIRECT
        })
   } catch (error) {
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return { error : "Invalid Credentials!"}
                default:
                    return { error : "Something went wrong"}
            }
        }
        throw error;
   }
};