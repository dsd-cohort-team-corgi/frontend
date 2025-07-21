"use client";

// https://www.youtube.com/watch?v=ebOgXUPG3_k

import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import axios from "axios";

// describes the user object
type UserContextObjectType = {
  user_name: string;
  $id?: string;
  profile_image?: string;
  $permission?: string[];
  $sequence?: string;
  $updatedAt?: string;
};

// describes the context value (what you put in Context.Provider)
type ContextProviderType = {
  currentUsersInfo: UserContextObjectType;
  setTriggerRecheck: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRecheck: boolean;
};

const Context = createContext<ContextProviderType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) {
  // ReactNode allows any valid React child (JSX, string, number, fragment, etc.).
  // This is the standard way to type children for a provider or layout component in React with TypeScript

  const [triggerRecheck, setTriggerRecheck] = useState(true);
  const [currentUsersId, setCurrentUsersId] = useState("guest");
  const [currentUsersInfo, setCurrentUsersInfo] =
    useState<UserContextObjectType>({
      user_name: "guest",
    });

  const getUserId = async () => {

    // this is a client component so we can't use this directly
    //  const user = await getSignedInUser();
    // instead we use fetch, since it uses a server only api to look at the cookies

    const res = await fetch("/api/get-signed-in-user");
    const data = await res.json();
    const user = data.user;
    console.log("getUserId() returned:", user);

    const usersId = user ? user.$id : "guest";
    // console.log(`this is users in getUserId ${JSON.stringify(usersId)}`);
    setCurrentUsersId(usersId);
    // use that id to now get users info
    // await was necessary here to avoid a race condition, where setTriggerRecheck(false) BEFORE setCurrentUsersInfo(user) is called, causing a race condition where the context value is not updated in time for the NavBar to see it.
    return usersId;
  };

  const getUsersInfo = async (usersId: string) => {
    console.log(`get Users Info Ran ${usersId}`);

    if (usersId !== "guest") {
      // console.log(`in if loop of getUsersInfo ${usersId}`);
      const usersData = await axios.post("/api/users/getspecificuser", {
        usersId,
      });

      // console.log(`getcurrentUsersData early ${JSON.stringify(usersData)}`);
      const user = usersData.data.trimmedUserObject;
      return user;
    } else {
      const user = null;
      return user;

      // console.log("user is a guest");
      // console.log(
      //   `this is currentUsersInfo ${JSON.stringify(currentUsersInfo)}`,
      // );
    }
  };

  const updateContextWithUserInfo = async (user: UserContextObjectType) => {
    //will be a user object
    if (user !== null) {
      setCurrentUsersInfo(user);
    } else {
      setCurrentUsersInfo({
        user_name: "guest",
      });
    }
  };
  useEffect(() => {
    console.log(
      "UserProvider useEffect running, triggerRecheck:",
      triggerRecheck,
    );

    //had to wrap the call in an async function due to the warning "useEffect must not return anything besides a function, which is used for clean-up" Because the callback getUserId() is returning a promise which is incompatible with useEffect, so it has to be wrapped in an async function
    if (triggerRecheck) {
      const loadData = async () => {
        const usersIdFromGetUserAuthFunc = await getUserId();

        const userInfoFromFunc = await getUsersInfo(usersIdFromGetUserAuthFunc);

        await updateContextWithUserInfo(userInfoFromFunc);
        //reset trigger to false, so we can retrigger it later if needed
        setTriggerRecheck(false);
      };
      loadData();
    } else {
      console.log(`trigger recheck is false ${triggerRecheck}`);
    }
  }, [triggerRecheck]);

  return (
    <Suspense>
      <Context.Provider
        value={{ currentUsersInfo, setTriggerRecheck, triggerRecheck }}
      >
        {children}
      </Context.Provider>
    </Suspense>
  );
};
export const useUser = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;

  //However, when trying to destructure the context later
  // const { currentUsersInfo, ...other } = useUser();

  //we got this typescript error:
  // the error given is Property 'currentUsersInfo' does not exist on type 'ContextProviderType | undefined'

  //Why? useUser() hook returns ContextProviderType | undefined, so TypeScript thinks the result could be undefined.

  //You can't destructure currentUsersInfo directly unless you guarantee the context is defined.

  //by making the hook throw if the context is missing, it satisfys typescript since it now knows it will never be undefined
};

//To use:
// import { useUser } from "../components/context-wrappers/UserInfo";

// const { currentUsersInfo, ...other } = useUser();
// let currentUsersId = currentUsersInfo ? currentUsersInfo.$id : "guest";
