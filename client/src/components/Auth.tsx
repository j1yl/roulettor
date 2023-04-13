import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useUserState } from "~/context/UserContext";

const Auth = () => {
  const { data: session } = useSession();
  const { userState } = useUserState();

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <p className="mr-4">{userState.balance}</p>
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
