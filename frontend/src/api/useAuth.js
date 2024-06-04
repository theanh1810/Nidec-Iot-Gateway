import useRequest from './useRequest'

const useAuth = () => {
	const { createPostRequest, cancel } = useRequest('auth')

	const login = ({ username, password }) => createPostRequest({
		endpoint: 'login',
		data: { username, password }
	})

	const logout = () => createPostRequest({
		endpoint: 'logout'
	})

	const verify = () => createPostRequest({
		endpoint: 'verify'
	})

	return {
		login,
		logout,
		verify,
		cancel
	}
}

export default useAuth