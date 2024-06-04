const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, STRING, FLOAT, DATE, BOOLEAN, INTEGER } = DataTypes

const Model = Db.define('MasterProduct', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Name: { type: STRING, allowNull: false },
	Symbols: { type: STRING, allowNull: false },
	Unit_ID: { type: BIGINT, allowNull: false },
	Packing_ID: { type: BIGINT },
	Packing_Standard: { type: FLOAT },
	Price: { type: FLOAT },
	Export_Type: { type: INTEGER },
	Type: { type: INTEGER },
	Spec: { type: STRING },
	Materials_ID: { type: BIGINT },
	Quantity: { type: FLOAT },
	Cycle_Time: { type: STRING },
	CAV: { type: INTEGER },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: BOOLEAN, allowNull: false }
}, {
	tableName: 'Master_Product',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated',
	hasTrigger: true
})
module.exports = Model