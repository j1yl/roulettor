import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type Props = {};

const Auth = (props: Props) => {
  const { data: session } = useSession();
  if (session?.user.email) {
    return (
      <div className="flex flex-col gap-2">
        <p>Email: {session?.user.email}</p>
        <p>User ID: {session?.user.id}</p>

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
