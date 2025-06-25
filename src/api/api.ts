import axios from "axios";
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

export type UsersData = UserData[];

export interface UserData {
	email: string;
	id: number;
	name: string;
	phone: string;
	username: string;
	website: string;
	address: {
		city: string;
		geo: {
			lat: string
			lng: string;
		};
		street: string;
		suite: string;
		zipcode: string;
	};
	company: {
		bs: string;
		catchPhrase: string;
		name: string;
	};
}

export const getUsers = async () => {
	const response = await axios.get<UsersData>('https://jsonplaceholder.typicode.com/users');
	const data = response.data;
	return data;
}