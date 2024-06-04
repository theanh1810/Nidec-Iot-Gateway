const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { STRING, BIGINT, DATE, FLOAT } = DataTypes

const Model = Db.define('InventoryMachine', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Machine_ID: { type: BIGINT },
	Quantity: { type: FLOAT },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: STRING },
}, {
	tableName: 'Inventory_Machine',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated'
})

module.exports = Model