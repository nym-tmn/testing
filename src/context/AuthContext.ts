import { createContext } from "react";

interface AuthContextType {
	isAuth: boolean;
	toggleAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);