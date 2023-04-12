import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Auth = () => {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <p>{session.user.id}</p>
        <button onClick={() => signOut()} className="redbtn">
          Logout
        </button>
      </div>
    );
  }
  return (
    <>
      <button onClick={() => signIn("google")} className="greenbtn">
        Login
      </button>
    </>
  );
};

export default Auth;
