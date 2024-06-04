const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { STRING, BIGINT, DATE, FLOAT, BOOLEAN } = DataTypes

const Model = Db.define('MasterMachine', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Name: { type: STRING },
	Symbols: { type: STRING },
	Stock_Max: { type: FLOAT },
	Stock_Min: { type: FLOAT },
	Note: { type: STRING },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: BOOLEAN },
	MAC: { type: STRING }
}, {
	tableName: 'Master_Machine',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated'
})

module.exports = Model