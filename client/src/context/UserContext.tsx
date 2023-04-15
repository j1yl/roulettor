import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, createContext, useContext, useEffect } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

interface UserState {
  id: string;
  name: string;
  email: string;
  balance: number;
  image: string;
}

interface UserStateContextType {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const defaultUserState: UserState = {
  id: "",
  name: "",
  email: "",
  balance: 0,
  image: "",
};

const UserStateContext = createContext<UserStateContextType>({
  userState: defaultUserState,
  setUserState: () => {},
});

type UserStateProviderProps = {
  children: React.ReactNode;
};

const UserStateProvider: React.FC<UserStateProviderProps> = ({
  children,
}: UserStateProviderProps) => {
  const [userState, setUserState] = useState<UserState>(defaultUserState);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      axios.get(`/api/user/${session.user.id}`).then((res) => {
        setUserState({
          ...userState,
          id: session.user.id,
          name: session.user.name as string,
          email: session.user.email as string,
          image: session.user.image as string,
          balance: res.data.user.balance,
        });
      });
    }
  }, [session]);

  useEffect(() => {
    socket.connect();
    socket.on("betReceived", (data: UserState) => {
      setUserState({
        ...data,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <UserStateContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserStateContext.Provider>
  );
};

const useUserState = () => useContext(UserStateContext);

export { UserStateProvider, useUserState };
