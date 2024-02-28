"use server"

import * as z from "zod"
import { RegisterSchema } from "@/schemas"
import bcrypt from "bcrypt"
import { db } from "@/lib/db";
import { getUserByEamil } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEamil } from "@/lib/mail";

export const register = async (values:z.infer<typeof RegisterSchema>) => {
    
    console.log(values);
    
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error : "Invalid fields"};
    }

    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUserByEamil(email);
    
    if(existingUser){
        return {error: "Eamil already in use!"};
    }

    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
        }
    });

    //Todo send verification token email!
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEamil(
        verificationToken.email,
        verificationToken.token
    )

    return {success : "Confirmation email sent!"};

};