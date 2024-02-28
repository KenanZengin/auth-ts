"use server"

import { db } from "@/lib/db"
import { getUserByEamil } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification"

export const newVerification = async(token:string) => {


    const existingToken = await getVerificationTokenByToken(token);

    if(!existingToken){
        return {error: "Token does not existing!"};
    }

    const hasExpires = new Date(existingToken.expires) < new Date();
    if(hasExpires){
        return {error : "token has expired!"};
    }

    const existingUser = await getUserByEamil(existingToken.email);
    if(!existingUser){
        return {error: "Email does not existing!2"}
    }

    await db.user.update({
        where:{id: existingUser.id},
        data:{
            emailVerified: new Date(),
            email: existingToken.email
        }
    });

    await db.verificationToken.delete({
        where:{id:existingToken.id}
    });

    return {success: "Email verified"}
}