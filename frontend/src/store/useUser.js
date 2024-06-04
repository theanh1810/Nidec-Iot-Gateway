import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUser = create(persist((set, get) => ({
    username: '',
    token: '',
    changeData: (data) => set({
        username: data.username,
        token: data.token
    }),
    resetData: () => set({
        username: '',
        token: ''
    })
}), {
    name: 'user'
}))

export default useUser