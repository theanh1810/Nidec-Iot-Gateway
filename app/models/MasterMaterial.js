const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, FLOAT, DATE, BOOLEAN, INTEGER, STRING } = DataTypes

const Model = Db.define('MasterMaterial', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Name: { type: STRING },
	Symbols: { type: STRING },
	Unit_ID: { type: INTEGER },
	Packing_ID: { type: INTEGER },
	Supplier_ID: { type: INTEGER },
	Model: { type: STRING },
	Standard_Unit: { type: FLOAT },
	Standard_Packing: { type: FLOAT },
	Part_ID: { type: STRING },
	Warehouse_ID: { type: BIGINT },
	Note: { type: STRING },
	Lead_Time: { type: FLOAT },
	Export_Type: { type: INTEGER },
	Preparation_Time: { type: FLOAT },
	Norms: { type: FLOAT },
	Spec: { type: STRING },
	Difference: { type: FLOAT },
	Wire_Type: { type: STRING },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Created: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	User_Updated: { type: BIGINT },
	IsDelete: { type: BOOLEAN, allowNull: false, defaultValue: false },
}, {
	tableName: 'Master_Materials',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated',
	hasTrigger: true
})

module.exports = Model