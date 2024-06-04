const NUMBER = 'Number'
const FUNCTION = 'Function'
const ASYNCFUNCTION = 'AsyncFunction'
const NULL = 'Null'
const UNDEFINED = 'Undefined'
const STRING = 'String'
const BOOLEAN = 'Boolean'
const ARRAY = 'Array'
const OBJECT = 'Object'
const MAP = 'Map'

const typeOf = type => Object.prototype.toString.call(type).slice(8, -1)

const isNumber = type => typeOf(type) === NUMBER

const isFunction = type => typeOf(type) === FUNCTION || typeOf(type) === ASYNCFUNCTION

const isAsyncFunction = type => typeOf(type) === ASYNCFUNCTION

const isNull = type => typeOf(type) === NULL

const isUndefined = type => typeOf(type) === UNDEFINED

const isString = type => typeOf(type) === STRING

const isBoolean = type => typeOf(type) === BOOLEAN

const isArray = type => typeOf(type) === ARRAY

const isObject = type => typeOf(type) === OBJECT

const isMap = type => typeOf(type) === MAP

module.exports = {
    typeOf,
    isNumber,
    isFunction,
    isAsyncFunction,
    isNull,
    isUndefined,
    isString,
    isBoolean,
    isArray,
    isObject,
    isMap
}