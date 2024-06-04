const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, STRING, FLOAT, DATE, BOOLEAN, INTEGER, DATEONLY } = DataTypes

const Model = Db.define('CommandProductionDetail', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Symbols: { type: STRING },
	Command_ID: { type: BIGINT },
	Mold_ID: { type: BIGINT },
	Quantity_Mold: { type: INTEGER },
	Product_ID: { type: BIGINT },
	Part_Action: { type: BIGINT },
	Process_ID: { type: BIGINT },
	Quantity: { type: FLOAT },
	Quantity_Production: { type: FLOAT },
	Count: { type: BIGINT },
	Quantity_Error: { type: FLOAT },
	Date: { type: DATEONLY },
	Time_Start: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Start') } },
	Time_End: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_End') } },
	Status: { type: INTEGER },
	Type: { type: INTEGER },
	Version: { type: STRING },
	His: { type: BIGINT },
	Time_Real_Start: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Real_Start') } },
	Time_Real_End: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Real_End') } },
	Group: { type: STRING },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') }  },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') }  },
	IsDelete: { type: BOOLEAN, allowNull: false, defaultValue: false },
	Cavity_Real: { type: INTEGER },
}, {
	tableName: 'Command_Production_Detail',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated',
	hasTrigger: true
})

module.exports = Model