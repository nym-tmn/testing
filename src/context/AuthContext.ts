import { createContext } from "react";

interface AuthContextType {
	isAuth: boolean;
	login: () => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);