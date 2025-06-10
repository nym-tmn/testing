import type { LoginData } from "../components/LoginModal/LoginModal";

export const authorization = (loginData: LoginData) => {

	const { email, password } = loginData;

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (email === 'test@mail.ru' && password === '12345678') {
				resolve(loginData)
			} else {
				reject(new Error('Неверный логин или пароль'))
			}
		}, 2000)
	})
}