import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, createContext, useContext, useEffect } from "react";

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
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      axios
        .get("/api/user/" + session?.user.id)
        .then((res) => {
          setUserState({
            balance: res.data.user.balance,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [session]);

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
