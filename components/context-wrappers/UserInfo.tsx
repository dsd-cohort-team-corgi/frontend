"use client";

// https://www.youtube.com/watch?v=ebOgXUPG3_k

import {
  createContext,
  Suspense,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

// describes the user object
type UserContextObjectType = Record<string, string | number | boolean>;

// describes the context value (what you put in Context.Provider)
type ContextProviderType = {
  currentUsersInfo: UserContextObjectType;
  setTriggerRecheck: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRecheck: boolean;
};

const Context = createContext<ContextProviderType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // ReactNode allows any valid React child (JSX, string, number, fragment, etc.).
  // This is the standard way to type children for a provider or layout component in React with TypeScript

  const [triggerRecheck, setTriggerRecheck] = useState(true);

  // since we'll be using setCurrentUsersInfo later, I'm temporarily disabling this warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUsersInfo, setCurrentUsersInfo] =
    useState<UserContextObjectType>({
      user_name: "guest",
    });
  const contextValue = useMemo(
    () => ({ currentUsersInfo, setTriggerRecheck, triggerRecheck }),
    [currentUsersInfo, triggerRecheck],
    // list of dependencies for useMemo to watch for changes
  );
  // why useMemo? To avoid potential rerenders / help performance
  // React will re-render every consumer of the context whenever the value prop changes — even if the change is just a new object reference and the values are technically the same!
  // this could trigger rerenders:
  //  <Context.Provider
  //     value={{ currentUsersInfo, setTriggerRecheck, triggerRecheck }}
  // Eslint error: The object passed as the value prop to the Context provider (at line 39) changes every render. To fix this consider wrapping it in a useMemo hook.
  //
  return (
    <Suspense>
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    </Suspense>
  );
}
export const useUser = () => {
  // a hook to easily call on the user information stored in this context
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "Error! useUser can only be used in a component wrapped in UserProvider",
    );
  }
  return context;

  // Reason for throw new Error logic: by making the hook throw if context is missing, typescript will allow the object to be destructured later since it satisfies typescripts worry about it potentially being undefined

  // const { currentUsersInfo, ...other } = useUser();

  // If the throw is removed you get this error:
  // Property 'currentUsersInfo' does not exist on type 'ContextProviderType | undefined'

  // Why? useUser() hook returns ContextProviderType | undefined, so TypeScript thinks the result could be undefined.

  // You can't destructure currentUsersInfo directly unless you guarantee the context is defined.

  // by making the hook throw if the context is missing, it satisfys typescript since it now knows it will never be undefined
};
