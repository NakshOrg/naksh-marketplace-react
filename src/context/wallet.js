import { createContext, useContext } from "react";

let intialValue = {};

export const AppContext = createContext(intialValue);

export function useAppContext() {
	return useContext(AppContext);
}
