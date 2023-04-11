import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date | null;
  image?: string;
  balance: number;
}

interface Props {
  id: string;
}

const Balance = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<User>();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    fetch("/api/user/" + props.id)
      .then((response) => response.json())
      .then((data: User) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex gap-2">
      <h3>Pouch: </h3>
      <p>{data?.balance} coins</p>
    </div>
  );
};

export default Balance;
