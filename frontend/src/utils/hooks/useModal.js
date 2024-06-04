import { useState } from 'react'

const useModal = (initialState = false) => {
	const [state, setState] = useState(initialState)

	const close = () => setState(false)

	const open = () => setState(true)
	
	return {
		state,
		open,
		close
	}
}

export default useModal