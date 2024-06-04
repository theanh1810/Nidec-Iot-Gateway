import vi from './vi'

const en = {}

Object.keys(vi).forEach(key => {
    en[key] = key
})

export default en