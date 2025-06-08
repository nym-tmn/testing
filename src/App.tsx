import { useState } from "react"
import { Button } from "./components/Button/Button"

const App = () => {

	const [isDisabled, setIsDisabled] = useState(false)

	const handleClick = () => {
		setIsDisabled(prev => !prev)
		setTimeout(() => {
			console.log('Button is pressed');
			setIsDisabled(prev => !prev)
		}, 1000)
	}

  return (
    <>
			<Button
				disabled={isDisabled}
				onClick={handleClick}
			>
				Press me
			</Button>
    </>
  )
}

export default App
