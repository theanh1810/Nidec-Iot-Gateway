const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_ONLY_FORMAT = 'YYYY-MM-DD'
const TIME_ONLY_FORMAT = 'HH:mm:ss'
const YEAR_MONTH_FORMAT = 'YYYY-MM'

const PATH = Object.freeze({
	STORAGE: `${process.cwd()}/storage`,
	TEMPLATE: `${process.cwd()}/template`,
	CACHE: `${process.cwd()}/app/cache`,
	WORKER: `${process.cwd()}/app/worker`,
	LOG: `${process.cwd()}/logs`,
	FRONTEND: `${process.cwd()}/frontend/build`,
	FRONTEND_STATIC: `${process.cwd()}/frontend/build/static`,
	IMAGE: `${process.cwd()}/storage/image`,
	REPORT: `${process.cwd()}/storage/excel/report`,
	FIRMWARE: `${process.cwd()}/firmware`
})

const ENV = Object.freeze({
	DEVELOP: 'develop',
	PRODUCT: 'production'
})

module.exports = {
	DATE_TIME_FORMAT,
	DATE_ONLY_FORMAT,
	TIME_ONLY_FORMAT,
	YEAR_MONTH_FORMAT,
	PATH,
	ENV
}