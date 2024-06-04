import { create } from 'zustand'

const useSider = create(set => ({
	width: 220,
	collapsed: false,
	setCollapsed: (value) => set({ collapsed: value }),
	collapse: () => set({ collapsed: true }),
	expand: () => set({ collapsed: false }),
	toggleCollapse: () => set(({ collapsed }) => ({ collapsed: !collapsed })),
	isHide: false,
	hide: () => set({ isHide: true }),
	show: () => set({ isHide: false }),
	toggle: () => set(({ isHide, collapsed }) => ({ isHide: !isHide, collapsed: !isHide ? false : collapsed  }))
}))

export default useSider