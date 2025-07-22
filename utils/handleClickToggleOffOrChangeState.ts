import { Dispatch, SetStateAction } from "react";

type OnClickToggleOffOrChangeStateType = {
  newId: string;
  setState: Dispatch<SetStateAction<string | undefined>>;
};

export default function onClickToggleOffOrChangeState({
  newId,
  setState,
}: OnClickToggleOffOrChangeStateType): void {
  // void = this function does not return a value, so it returns a value of void
  setState((previousStateValue) =>
    previousStateValue === newId ? undefined : newId,
  );
}
