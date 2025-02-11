// import NextAuth, { Account, User as NextAuthUser, Profile } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import { InvalidAuthError } from "./interfaces/auth.error";
// import { login, refreshToken } from "./helpers/handlers/auth";
// import { jwtDecode } from "jwt-decode";
// import { AdapterUser } from "next-auth/adapters";
// interface User extends NextAuthUser {
//   access_token?: string;
//   refresh_token?: string;
// }
// const authOptions = {
//   session: {
//     strategy: "jwt" as const,
//     maxAge: 2 * 60, // 2 menit
//   },
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         console.log("Mencoba login dengan:", credentials);
//         try {
//           if (credentials) {
//             const user = await login(credentials);
//             console.log("Hasil login:", user);
//             return user;
//           }
//           throw new InvalidAuthError("Credentials are undefined");
//         } catch (error: unknown) {
//           throw new InvalidAuthError(error);
//         }
//       },
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//     }),
//     Google({
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//       clientId: "",
//       clientSecret: "",
//     }),
//   ],
//   callbacks: {
//     signIn({
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       user,
//       account,
//       profile,
//     }: {
//       user: User | AdapterUser;
//       account: Account | null;
//       profile?: Profile;
//     }) {
//       if (account?.provider == "google") {
//         return (
//           (profile as { email_verified?: boolean })?.email_verified || false
//         );
//       }
//       return true;
//     },
//     async jwt({
//       token,
//       user,
//       trigger,
//     }: {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       token: any;
//       user?: User;
//       trigger?: string;
//     }) {
//       if (user) {
//         const { access_token, refresh_token } = user;
//         return {
//           access_token,
//           refresh_token,
//         };
//       } else if (token?.refresh_token || trigger == "update") {
//         const newToken = await refreshToken(token.refresh_token!);
//         return newToken;
//       }
//       return token;
//     },
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     async session({ session, token }: { session: any; token: any }) {
//       if (token.access_token) {
//         const user = jwtDecode<User>(token.access_token as string);
//         session.user.access_token = user.access_token as string;
//         session.user.id = user.id as string;
//         session.user.user_id = user.user_id as number;
//         session.user.username = user.username as string;
//         session.user.email = user.email as string;
//         session.user.role = user.role as string;
//         session.user.img_src = user.img_src as string;
//         session.user.reference_code = user.reference_code as string;
//         session.user.applied_reference_code =
//           user.applied_reference_code as string;
//         session.user.created_at = user.created_at as Date;
//         session.user.updated_at = user.updated_at as Date;
//         console.log("Session Data Updated:", session);
//       }
//       return session;
//     },
//   },
// };

// const { signIn, signOut, auth, handler } = NextAuth(authOptions);

// export { handler as GET, handler as POST };
// export { signIn, signOut, auth };
// // **Perbaikan: Buat instance NextAuth**
