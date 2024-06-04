const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, FLOAT, DATE, BOOLEAN, TEXT } = DataTypes

const Model = Db.define('OeeDay', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Master_Machine_ID: { type: BIGINT, allowNull: false },
	A: { type: FLOAT, allowNull: false  },
	P: { type: FLOAT, allowNull: false  },
	Q: { type: FLOAT, allowNull: false  },
	A_LOSS: { type: FLOAT, allowNull: false  },
	P_LOSS: { type: FLOAT, allowNull: false  },
	Q_LOSS: { type: FLOAT, allowNull: false  },
	Note: { type: TEXT },
	User_Created: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Updated: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	IsDelete: { type: BOOLEAN, allowNull: false }
}, {
	tableName: 'Oee_Day',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated'
})
module.exports = Model