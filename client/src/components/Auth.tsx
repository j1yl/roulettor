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
      <>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            className="h-5 w-5 fill-primary"
          >
            <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
          </svg>
          <p className="md:mr-4">{balance}</p>
          <button onClick={() => signOut()} className="btn-primary btn">
            Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <button onClick={() => signIn("google")} className="btn-primary btn">
        Login
      </button>
    </>
  );
};

export default Auth;
