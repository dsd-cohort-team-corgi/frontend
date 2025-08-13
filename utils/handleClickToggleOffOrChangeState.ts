import { Dispatch, SetStateAction } from "react";

type OnClickToggleOffOrChangeStateType = {
  newId: string;
  setState: Dispatch<SetStateAction<string | undefined>>;
};

export default function onClickToggleOffOrChangeState({
  newId,
  setState,
}: OnClickToggleOffOrChangeStateType): void {
  setState((previousStateValue) =>
    previousStateValue === newId ? undefined : newId,
  );
}
