import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState(false);

	const toggleAuth = () => {
		setIsAuth(prev => !prev);
	}

	return (
		<AuthContext.Provider value={{ isAuth, toggleAuth }}>
			{children}
		</AuthContext.Provider>
	)
}