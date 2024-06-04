const {
	readdirSync,
	rmSync,
	mkdirSync,
	existsSync,
	copyFileSync,
	statSync
} = require('fs')

const DIRECTORY = 0
const FILE = 1

const getFileSize = (dir) => {
	const stat = statSync(dir)
	return stat.size
}

const getDirectories = (dir = '') => {
	return readdirSync(dir, {
		withFileTypes: true
	}).map(dirent => {
		switch (true) {
			case dirent.isDirectory():
				return { name: dirent.name, type: DIRECTORY }
			case dirent.isFile():
				return { name: dirent.name, type: FILE }
			default:
				return
		}
	})
}

const createDirectory = (dir) => {
	if (dir) {
		mkdirSync(dir, {
			recursive: true
		})
	} else {
		throw new Error('createDirectory: dir can not empty')
	}
}

const copyDirectory = (originPath, destinationPath) => {
	copyFileSync(originPath, destinationPath)
}

const removeDirectory = (dir) => {
	if (dir) {
		rmSync(dir, {
			recursive: true,
			force: true
		})
	} else {
		throw new Error('removeDirectory: dir can not empty')
	}
}

const checkExists = (dir) => {
	if (dir) {
		return existsSync(dir)
	} else {
		throw new Error('existsDirectory: dir can not empty')
	}
}

module.exports = {
	getFileSize,
	getDirectories,
	createDirectory,
	copyDirectory,
	checkExists,
	removeDirectory
}
