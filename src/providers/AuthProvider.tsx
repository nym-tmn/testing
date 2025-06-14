import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState(false);

	const login = () => {
		setIsAuth(prev => !prev);
	}

	const logout = () => {
		setIsAuth(prev => !prev);
	}

	return (
		<AuthContext.Provider value={{ isAuth, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}