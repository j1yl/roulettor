import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useUserState } from "~/context/UserContext";

const Auth = () => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);

  const { userState } = useUserState();

  useEffect(() => {
    setBalance(userState.balance);
  }, [userState]);

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <p className="btn">Balance: {balance}</p>
        <button onClick={() => signOut()} className="btn">
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => signIn("google")} className="btn">
        Login
      </button>
    </>
  );
};

export default Auth;
