import { create } from 'zustand'

const useProvider = create(set => ({
	redirectPath: '/',
	setRedirectPath: redirectPath => set({ redirectPath }),
	lang: 'en',
	setLang: (value) => set({ lang: value })
}))

export default useProvider