const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, INTEGER, FLOAT, DATE, BOOLEAN, TEXT } = DataTypes

const Model = Db.define('ProductionLog', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Command_Production_Detail_ID: { type: BIGINT, allowNull: false },
	Master_Shift_ID: { type: BIGINT, allowNull: false },
	Master_Machine_ID: { type: BIGINT, allowNull: false },
	Total: { type: BIGINT, allowNull: false  },
	NG: { type: BIGINT, allowNull: false  },
	Runtime: { type: FLOAT, allowNull: false  },
	Stoptime: { type: FLOAT, allowNull: false  },
	Cavity: { type: INTEGER, allowNull: false  },
	Cycletime: { type: FLOAT, allowNull: false  },
	Note: { type: TEXT },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: BOOLEAN, allowNull: false },
	Master_Status_ID: { type: INTEGER }
}, {
	tableName: 'Production_Log',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated'
})
module.exports = Model