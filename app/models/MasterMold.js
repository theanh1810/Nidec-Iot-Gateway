const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, STRING, DATE, BOOLEAN, INTEGER } = DataTypes

const Model = Db.define('MasterMold', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Name: { type: STRING, allowNull: false },
	Symbols: { type: STRING, allowNull: false },
	CAV_Max: { type: INTEGER },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: BOOLEAN, allowNull: false }
}, {
	tableName: 'Master_Mold',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated',
	hasTrigger: true
})

module.exports = Model