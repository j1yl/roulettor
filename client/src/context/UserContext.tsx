import React, { useState, createContext, useContext, useEffect } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

interface UserState {
  balance: number;
}

interface UserStateContextType {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const defaultUserState: UserState = {
  balance: 0,
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

  useEffect(() => {
    socket.connect();
    socket.on("betReceived", (data: number) => {
      setUserState({ balance: data });
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <UserStateContext.Provider
      value={{ userState, setUserState: setUserState }}
    >
      {children}
    </UserStateContext.Provider>
  );
};

const useUserState = () => useContext(UserStateContext);

export { UserStateProvider, useUserState };
