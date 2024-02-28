"use server"

import * as z from "zod"
import { getUserByEamil } from "@/data/user"
import { db } from "@/lib/db"
import { ResetSchema } from "@/schemas"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/data/tokens"

export const reset = async(values: z.infer<typeof ResetSchema>) => {

    const validateFields = ResetSchema.safeParse(values);

    if(!validateFields.success){
        return {error : "Invalid Email"};
    }

    const {email} = validateFields.data;

    const existingUser = await getUserByEamil(email);

    if(!existingUser){
        return {error : "Eamil not found!"};
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return {success: "Reset email send"}

}