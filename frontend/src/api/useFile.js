import useRequest from './useRequest'

const useFile = () => {
	const { createGetRequest, createPostRequest, cancel } = useRequest('file')

	const getFiles = (dir = '') => createPostRequest({
		endpoint: '',
		data: { dir }
	})

	const uploadFiles = ({ formData, onUploadProgress }) => createPostRequest({
		endpoint: '/upload',
		data: formData,
		timeout: 0,
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		onUploadProgress
	})

	const downloadFile = (file) => createGetRequest({
		endpoint: '/download',
		params: { file }
	})

	const removeFile = (file) => createPostRequest({
		endpoint: '/remove',
		data: { file }
	})

	return {
		getFiles,
		uploadFiles,
		downloadFile,
		removeFile,
		cancel
	}
}

export default useFile