import { useState } from "react"
import { Button } from "./components/Button/Button"
import { LoginModal } from "./components/LoginModal/LoginModal"
import { useAuth } from "./hooks/useAuth";

const App = () => {

	const { isAuth, logout } = useAuth();

	const [isOpenModal, setIsOpenModal] = useState(false)

	const handleShowModalClick = () => {
		setIsOpenModal(prev => !prev)
	}

	return (
		<div data-testid='app'>
			{isAuth
				? <>
					<p>Вы авторизованы!!!</p>
					<Button onClick={logout}>Выйти</Button>
				</>
				: <Button onClick={handleShowModalClick}>
					Авторизоваться
				</Button>
			}
			{isOpenModal && <LoginModal handleShowModalClick={handleShowModalClick} />}
		</div>
	)
}

export default App
