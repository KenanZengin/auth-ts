import NextAuth from "next-auth";
import authConfig from "./auth.config";
import{
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
    authRoutes,
    apiAuthPrefix
} from "./routes"


const {auth} = NextAuth(authConfig)

export default auth((req) => {

    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute: boolean = nextUrl.pathname.startsWith(apiAuthPrefix); // url kısmı api ile başlıyorsa true döndürür
    const isPublicRoute:  boolean = publicRoutes.includes(nextUrl.pathname); // url kısmı publicRoutes'dan ise true döndürür
    const isAuthRoute:    boolean = authRoutes.includes(nextUrl.pathname); // url kısmı authRoutes'dan bir ifade içeriyorsa true döndürür

    if(isApiAuthRoute){
        return null; // bu rotaya gelirsek birşey yapma diyoruz
    }

    if(isAuthRoute){
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl));
        }
        return null;
    }

    if(!isLoggedIn && !isPublicRoute){ // tokenı yoksa ve public olmayan sayfalardan birine giderse login sayfasına yönlendirme yapıyoruz

        let callBackUrl = nextUrl.pathname;
        if(nextUrl.search){
            callBackUrl+= nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callBackUrl);
        console.log({
            "callbackUrl_1": nextUrl.pathname,
            "nextUrl.search" : nextUrl.search,
            "callbackUrl_2": callBackUrl,
            "encodedCallbackUrl": encodedCallbackUrl
        });
        

        return Response.redirect(new URL(`/auth/login?callbackurl=${encodedCallbackUrl}`,nextUrl));
    }

    return null;
    
})


export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"], // tüm sayfaları config içine tanımladık
};