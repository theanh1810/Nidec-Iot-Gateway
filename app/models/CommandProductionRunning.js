const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, DATE, BOOLEAN, TINYINT } = DataTypes

const Model = Db.define('Command_Production_Running', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Command_ID: { type: BIGINT },
	Command_Detail_ID: { type: BIGINT },
	Machine_ID: { type: BIGINT },
	Mold_ID: { type: BIGINT },
	Product_ID: { type: BIGINT },
	Status: { type: TINYINT },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') }  },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') }  },
	IsDelete: { type: BOOLEAN, allowNull: false, defaultValue: false },
}, {
	tableName: 'Command_Production_Running',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated',
	hasTrigger: true
})

module.exports = Model