import { useEffect, useState } from 'react'

const useMouted = () => {
	const [mouted, setMouted] = useState(false)

	useEffect(() => {
		setMouted(true)
	}, [])

	return mouted
}

export default useMouted