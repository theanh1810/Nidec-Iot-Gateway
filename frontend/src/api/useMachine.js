import useRequest from './useRequest'

const useMachine = () => {
	const { createGetRequest, cancel } = useRequest('machine')

	const getMachines = () => createGetRequest({
		endpoint: '/'
	})

	return {
		getMachines,
		cancel
	}
}

export default useMachine