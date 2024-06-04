import { create } from 'zustand'
import { isFunction, isString } from '../utils/checkType'
import { v4 } from 'uuid'

const useListener = create((set, get) => ({
	subscriber: {},
	on: (eventName, callback) => {
		if (!isString(eventName)) throw new Error('event name must be a string')
		if (!isFunction(callback)) throw new Error('callback must be a function')
		const key = v4()
		set(({ subscriber }) => {
			if (eventName in subscriber) {
				const event = subscriber[eventName]
				return { subscriber: { ...subscriber, [eventName]: { ...event, [key]: callback } } }
			} else {
				return { subscriber: { ...subscriber, [eventName]: { [key]: callback } } }
			}
		})
		return key
	},
	off: (eventName, key) => {
		if (!isString(eventName)) throw new Error('event name must be a string')
		if (!isString(key)) throw new Error('event key must be a string')
		set(({ subscriber }) => {
			if (eventName in subscriber) {
				const event = subscriber[eventName]
				if (key in event) {
					delete event[key]
					return { subscriber: { ...subscriber, [eventName]: { ...event } } }
				}
			}
		})
	},
	emit: (eventName, e) => {
		if (!isString(eventName)) throw new Error('event name must be a string')
		const subscriber = get().subscriber
		if (eventName in subscriber) {
			const event = subscriber[eventName]
			Object.values(event).forEach(callback => callback(e))
		}
	}
}))

export default useListener