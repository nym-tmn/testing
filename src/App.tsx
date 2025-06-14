import { useState } from "react"
import { Button } from "./components/Button/Button"
import { LoginModal } from "./components/LoginModal/LoginModal"
import { useAuth } from "./hooks/useAuth";

const App = () => {

	const { isAuth, toggleAuth } = useAuth();

	const [isOpenModal, setIsOpenModal] = useState(false)

	const handleModalClick = () => {
		setIsOpenModal(prev => !prev)
	}

	return (
		<div data-testid='app'>
			{isAuth
				? <>
					<p>Вы авторизованы!!!</p>
					<Button onClick={toggleAuth}>Выйти</Button>
				</>
				: <Button onClick={handleModalClick}>
					Авторизоваться
				</Button>
			}
			{isOpenModal && <LoginModal handleModalClick={handleModalClick} />}
		</div>
	)
}

export default App
