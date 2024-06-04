import useTranslate from '../lang/useTranslate'
import { useNavigate } from 'react-router-dom'
import { message, notification } from 'antd'
import { useLocation } from 'react-router-dom'
import useProvider from '@@store/useProvider'

import { HTTP_STATUS } from '../configs/app.config'

const {
    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    TOO_MANY_REQUEST,
    SERVER_ERROR,
} = HTTP_STATUS

const useHandleError = () => {
    const { setRedirectPath } = useProvider()
    const location = useLocation()
    const navigate = useNavigate()
    const t = useTranslate()
    
    const handleError = (error) => {
        const { response, request } = error
        
        if(response) {
            const { data, status } = response

            // console.log(response)

            switch(status) {
                case BAD_REQUEST:
                    message.warning(t(data.message ?? 'bad request').toUpperFirst())
                    break
                case UNAUTHORIZED:
                    setRedirectPath(location.pathname)
                    notification.info({
                        key: 'UNAUTHORIZED',
                        message: t('login session expired').toUpperFirst(),
                        description: t('please login again').toUpperFirst(),
                        placement: 'bottomRight'
                    })
                    navigate('/login')
                    break
                case NOT_FOUND:
                    message.error(t('url not found').toUpperFirst())
                    break
                case METHOD_NOT_ALLOWED:
                    message.error(t('method not allowed').toUpperFirst())
                    break
                case TOO_MANY_REQUEST:
                    message.error(t('too many request').toUpperFirst())
                    break
                case SERVER_ERROR:
                    notification.error({
                        message: t('server error').toUpperFirst(),
                        description: data.message,
                        placement: 'bottomRight'
                    })
                    break
                default:
                    message.error(`${t('error').toUpperFirst()}: ${status}`)
                    break
            }

            return data

        } else if(request) {
            const { _hasError, _sent } = request

            // console.log({request})

            if(_hasError) {
                if(_sent) {
                    message.error(t('server not respond').toUpperFirst())
                } else {
                    message.error(t('network error').toUpperFirst())
                }
            } else {
                message.error('request error unknown')
                // console.log(1)
                // error any
            }
        } else {
            message.error('error unknown')
            // console.log(error)
            // console.log(2)
            // console.log({error})
            // error any
        }
    }

    return handleError
}

export default useHandleError