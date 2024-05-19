import { withAuth } from "next-auth/middleware";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import {NextRequest, NextResponse} from 'next/server';


export default withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  {
    // session: { strategy: 'jwt' },
    callbacks: {
      authorized: ({token, req }) => {
        try {
          const authCookie : RequestCookies = req.cookies;
          console.log(authCookie);
          if (authCookie == null) {
            return false;
          }
          const cookie = authCookie.get('next-auth.session-token');

          console.log(cookie);
          if (cookie == null) {
            return false;
          }
          token = cookie;
        } catch (error) {
          console.log(error);
          return false;
        }
        console.log(token);
        console.log(req.cookies)
        // the route to auth can be accessed without token
        console.log(req.nextUrl.pathname);

        return token != null;
      }
    },
    pages: {
      signIn: '/auth/login'
    }
  }
);

export const config = { 
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}