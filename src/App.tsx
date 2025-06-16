import { useState } from "react"
import { Button } from "./components/Button/Button"
import { LoginModal } from "./components/LoginModal/LoginModal"
import { useAuth } from "./hooks/isAuth/useAuth";

const App = () => {

	const { isAuth, logout } = useAuth();

	const [isOpenModal, setIsOpenModal] = useState(false)

	return (
		<div data-testid='app'>
			{isAuth
				? <>
					<p>Вы авторизованы!!!</p>
					<Button onClick={logout}>Выйти</Button>
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
