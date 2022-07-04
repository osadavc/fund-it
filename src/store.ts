import create from "zustand";
import { UserI } from "models/User";

interface Store {
  user: UserI | null;
  replaceUser: (user: UserI | null) => void;
}

const useStore = create<Store>((set, get) => ({
  user: null,
  replaceUser: (user: UserI | null) =>
    set(
      (prevState) =>
        ({
          user: {
            ...prevState.user,
            ...user,
          },
        } as any)
    ),
}));

export default useStore;
