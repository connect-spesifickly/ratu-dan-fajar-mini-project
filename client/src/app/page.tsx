"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>Silakan login untuk mengakses dashboard.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }
  return (
    <div>
      \<h1>Dashboard</h1>
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
