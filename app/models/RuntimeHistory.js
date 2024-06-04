const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, FLOAT, DATE, BOOLEAN, TEXT } = DataTypes

const Model = Db.define('RuntimeHistory', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Production_Log_ID: { type: BIGINT, allowNull: false },
	Master_Shift_ID: { type: BIGINT, allowNull: false },
	Master_Machine_ID: { type: BIGINT, allowNull: false },
	IsRunning: { type: BOOLEAN, allowNull: false },
	Master_Status_ID: { type: BIGINT, allowNull: false },
	Duration: { type: FLOAT, allowNull: false  },
	Note: { type: TEXT },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: BOOLEAN, allowNull: false }
}, {
	tableName: 'Runtime_History',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated'
})
module.exports = Model