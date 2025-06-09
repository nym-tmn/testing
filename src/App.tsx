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

		<>
			{isAuth
				? <>
					<p>Вы авторизованы!!!</p>
					<Button type="button" onClick={toggleAuth}>Выйти</Button>
				</>
				: <Button type="button" onClick={handleModalClick}>
					Авторизоваться
				</Button>
			}
			<LoginModal isOpenModal={isOpenModal} handleModalClick={handleModalClick} />
		</>
	)
}

export default App
