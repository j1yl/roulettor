import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useUserState } from "~/context/UserContext";
import axios from "axios";

const Auth = () => {
  const { data: session } = useSession();
  const { userState } = useUserState();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (session?.user.id) {
      axios.get("/api/user/" + session.user.id).then((res) => {
        userState.balance = res.data.user.balance;
        setBalance(userState.balance);
      });
    }
  }, [session]);

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
