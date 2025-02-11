import { jwtDecode } from "jwt-decode";
import NextAuth, { SessionStrategy, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 2 * 60, // 2 menit
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(process.env.AUTH_BACKEND_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          const response = await res.json();
          console.log("Login Data:", response);
          console.log("refresh token:", response.data.refresh_token);
          if (res.status !== 200 || !response.data.access_token)
            throw new Error(response.message || "Invalid credentials");
          const decoded = jwtDecode(response.data.access_token) as User;
          console.log("User Data:", decoded);
          const user = {
            id: decoded.user_id?.toString() || "", // Ensure 'id' is a string
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            user_id: decoded.user_id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            img_src: decoded.img_src,
            reference_code: decoded.reference_code,
            applied_reference_code: decoded.applied_reference_code,
            created_at: decoded.created_at,
            updated_at: decoded.updated_at,
          };
          console.log("User Data:", user);
          return user; // Simpan token JWT dari backend;
        } catch (error) {
          console.error("Login Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.user_id = user.user_id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.img_src = user.img_src;
        token.reference_code = user.reference_code;
        token.applied_reference_code = user.applied_reference_code;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
        token.expires_at = Math.floor(Date.now() / 1000) + 120; // 2 menit
      }
      // Auto Refresh Token
      if (user) {
        const cookieStore = cookies();
        if (user.access_token) {
          (await cookieStore).set("auth_token", user.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 2 * 60, // 2 menit
          });
        }
        if (user.refresh_token) {
          (await cookieStore).set("auth_refresh_token", user.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 20 * 60, // 20 menit
          });
        }
        console.log("token store in cookies:", {
          access_token: user.access_token,
          refresh_token: user.refresh_token,
        });
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: Session; token: any }) {
      console.log("token in session:", session);
      session.user.access_token = token.access_token as string;
      session.user.refresh_token = token.refresh_token as string;
      session.user.id = token.id as string;
      session.user.user_id = token.user_id as number;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.img_src = token.img_src as string;
      session.user.reference_code = token.reference_code as string;
      session.user.applied_reference_code =
        token.applied_reference_code as string;
      session.user.created_at = token.created_at as Date;
      session.user.updated_at = token.updated_at as Date;
      console.log("Session Data Updated:", session);
      return session;
    },
  },
  //   events: {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     async signIn({ user }: { user: any }) {
  //       if (user?.token) {
  //         const cookieStore = cookies();
  //         (await cookieStore).set("auth_token", user.access_token, {
  //           httpOnly: true,
  //           secure: process.env.NODE_ENV === "production",
  //           path: "/",
  //           maxAge: 2 * 60, // 2 menit
  //         });
  //         (await cookieStore).set("auth_refresh_token", user.refresh_token, {
  //           httpOnly: true,
  //           secure: process.env.NODE_ENV === "production",
  //           path: "/",
  //           maxAge: 20 * 60, // 20 menit
  //         });
  //         console.log("token store in cookies:", {
  //           access_token: user.access_token,
  //           refresh_token: user.refresh_token,
  //         });
  //       }
  //     },
  //   },
  secret: process.env.NEXTAUTH_SECRET,
};

// **Perbaikan: Buat instance NextAuth**
const handler = NextAuth(authOptions);
// **Gunakan Named Export Sesuai Next.js 14**
export const GET = handler;
export const POST = handler;

// export { GET, POST } from "@/auth";
