import { useCallback, useEffect, useState } from "react"
import { Button } from "./components/Button/Button"
import { LoginModal } from "./components/LoginModal/LoginModal"
import { useAuth } from "./hooks/isAuth/useAuth";
import { getUsers, type UsersData } from "./api/api";

const App = () => {

	const { isAuth, logout } = useAuth();

	const [isOpenModal, setIsOpenModal] = useState(false);
	const [users, setUsers] = useState<UsersData | null>(null);

	const getAxiosUsers = useCallback(async () => {
		const data = await getUsers();
		setUsers(data)
	}, [])

	useEffect(() => {
		if (isAuth) {
			getAxiosUsers();
		}
	}, [getAxiosUsers, isAuth])

	return (
		<div data-testid='app'>
			{isAuth
				? <>
					<p>Вы авторизованы!!!</p>
					<Button onClick={logout}>Выйти</Button>
					<h3>Список пользователей:</h3>
					{users && <ul data-testid='users-list'>
						{users.map((user) => (
							<li key={user.id}>{user.name}</li>
						))}
					</ul>}
				</>
				: <Button onClick={() => setIsOpenModal(true)}>
					Авторизоваться
				</Button>
			}
			<LoginModal isOpenModal={isOpenModal} handleClose={() => setIsOpenModal(false)} />
		</div>
	)
}

export default App
