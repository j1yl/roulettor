import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type Props = {};

const Auth = (props: Props) => {
  const { data: session } = useSession();
  if (session?.user.email) {
    return (
      <div>
        <p>{session?.user.email}</p>
        <p>{session?.user.id}</p>

        <button onClick={() => signOut()}>Sign out with Google</button>
      </div>
    );
  }
  return (
    <>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
};

export default Auth;
