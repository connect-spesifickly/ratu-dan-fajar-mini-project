/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
declare module "next-auth" {
  interface User {
    access_token?: string | undefined;
    refresh_token?: string | undefined;
    user_id?: number;
    username?: string;
    email?: string;
    role?: string;
    img_src?: string | null;
    reference_code?: string | null;
    applied_reference_code?: string | null;
    created_at?: Date;
    updated_at?: Date | null;
  }
  interface Session {
    user: User;
  }
}
import { JWT } from "next-auth/jwt";
declare module "next-auth/jwt" {
  export interface JWT {
    access_token?: string | undefined;
    refresh_token?: string | undefined;
  }
}
