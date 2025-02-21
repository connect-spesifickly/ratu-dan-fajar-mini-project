"use client";

import { Navbar } from "@/components/navbar";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>Silakan login untuk mengakses dashboard.</p>
        <a href={"/loginPage"}>Sign In</a>
      </div>
    );
  }
  return (
    <div>
      <Navbar name="Main Page" />\<h1 className="mt-[46px]">Dashboard</h1>
      <p>Welcome, {session.user.username}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <p>Token: {session.user.access_token}</p>
      <p>reference_code: {session.user.reference_code}</p>
      <p>created_at: {session.user.created_at?.toString()}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
