import useRequest from './useRequest'

const useIot = () => {
    const { createGetRequest, createPostRequest, cancel } = useRequest('iot')

    const getIots = () => createGetRequest({
        endpoint: ''
    })

    const createIot = ({ mac, name, machineId }) => createPostRequest({
        endpoint: 'create',
        data: { mac, name, machineId }
    })

    const updateIot = ({ oldMac, newMac, name, machineId }) => createPostRequest({
        endpoint: 'update',
        data: { oldMac, newMac, name, machineId }
    })

    const deleteIot = (mac) => createPostRequest({
        endpoint: 'destroy',
        data: { mac }
    })

    const updateFirmware = ({ macs, path, selectedFile }) => createPostRequest({
        endpoint: 'update-firmware',
        data: { macs, path, selectedFile }
    })

    const sendEvent = ({ socketId, event, payload }) => createPostRequest({
        endpoint: 'send-event',
        data: { socketId, event, payload }
    })

    return {
        getIots,
        createIot,
        updateIot,
        deleteIot,
        updateFirmware,
        sendEvent,
        cancel
    }
}

export default useIot