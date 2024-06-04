import { useEffect, useState, useCallback } from 'react'
import useUSer from '../store/useUser'
import axios from 'axios'
import useHandleError from './useHandleError'
import { isFunction } from '../utils/checkType'
import useTranslate from '../lang/useTranslate'
import { message as antdMessage } from 'antd'
import { HOST, PORT } from '../configs/app.config'

const useRequest = (prefixPath = '') => {
    const t = useTranslate()
    const { token } = useUSer()
	const handleError = useHandleError()
    const [controller, setController] = useState(new AbortController())

    const createRequest = () => axios.create({
        baseURL: `http://${HOST}:${PORT}/api/${prefixPath}`,
        timeout: 16000,
        headers: {
            Accept: 'application/json',
            Authorization: token
        },
        signal: controller.signal
    })

    const [request, setRequest] = useState(() => createRequest())

    const createGetRequest = ({ endpoint, includeResHeaders = false, ...options }) => {
        return (
            request
            .get(endpoint, options)
            .then(res => {
                const { data } = res
                if(data) {
                    const { message } = data
                    message && antdMessage.success(t(message))
                }
                return {
                    success: true,
                    data: includeResHeaders ? res : data
                }
            })
            .catch(err => {
                const data = handleError(err)
                return {
                    success: false,
                    data
                }
            })
        )
    }

    const createPostRequest = ({ endpoint, data, includeResHeaders = false, ...options }) => {
        return (
            request
            .post(endpoint, data, options)
            .then(res => {
                const { data } = res
                if(data) {
                    const { message } = data
                    message && antdMessage.success(t(message))
                }
                return {
                    success: true,
                    data: includeResHeaders ? res : data
                }
            })
            .catch(err => {
                const data = handleError(err)
                return {
                    success: false,
                    data
                }
            })
        )
    }

    const cancel = () => {
        controller.abort()
        setController(new AbortController())
    }

    useEffect(() => {
        setRequest(() => createRequest())
    }, [controller])

    return {
        request,
        createGetRequest,
        createPostRequest,
        cancel
    }
}

export default useRequest