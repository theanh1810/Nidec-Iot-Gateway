const browserEvent = require('@events/browser.event')
const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')
const MasterMachine = require('./MasterMachine')

const { STRING, BOOLEAN, BIGINT, DATE } = DataTypes

const Model = Db.define('MasterIot', {
	Mac: 			{ type: STRING(17), primaryKey: true },
	Name: 			{ type: STRING(50), allowNull: false },
	Version: 		{ type: STRING },
	SocketID: 		{ type: STRING },
	MachineID:		{ type: BIGINT },
	IsConnected:	{ type: BOOLEAN, allowNull: false, defaultValue: false },
	User_Created:	{ type: BIGINT },
	Time_Created:	{ type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated:	{ type: BIGINT },
	Time_Updated:	{ type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
}, {
	tableName: 'Master_Iot',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated'
})

Model.afterUpdate(browserEvent.updateIot)

Model.hasOne(MasterMachine, {
	as: 'machine',
	sourceKey: 'MachineID',
	foreignKey: 'ID'
})

module.exports = Model