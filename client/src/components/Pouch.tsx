import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface UserResponse {
  data: {
    user: {
      balance: number;
    };
  };
}

const Pouch = () => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    if (session?.user.id) {
      axios
        .get(`/api/user/${session?.user.id}`)
        .then((res: UserResponse) => {
          setBalance(res.data.user.balance);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });

  if (balance) {
    return (
      <div className="btn-outline btn pointer-events-none flex gap-1">
        <span className="hidden md:flex">Pouch: </span>
        <p>{balance}</p>
      </div>
    );
  }

  return <></>;
};

export default Pouch;
