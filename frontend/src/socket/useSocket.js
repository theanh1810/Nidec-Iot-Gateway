import { useMemo } from 'react'
import { io } from 'socket.io-client'

import { HOST, PORT, SOCKET_AUTHORIZATION } from '../configs/app.config'

const useSocket = () => {
    const socket = useMemo(() => {
        return io(
            `http://${HOST}:${PORT}`,
            {
                extraHeaders: {
                    authorization: SOCKET_AUTHORIZATION,
                }
            }
        )
    }, [])

    return socket
}

export default useSocket