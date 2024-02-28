"use server"

import { signOut } from "@/auth"

export const logout = async () => { // logout'u client sayfasında yapmak istediğimiz zaman bu dosyayı çağırarak server side logout yaptırabiliriz.
    // some server stuff
    await signOut();
}

