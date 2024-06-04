const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')
const MasterProduct = require('./MasterProduct')
const MasterMaterial = require('./MasterMaterial')
const MasterMold = require('./MasterMold')

const { BIGINT, FLOAT, DATE, BOOLEAN, INTEGER } = DataTypes

const Model = Db.define('MasterBom', {
	ID: { type: BIGINT, primaryKey: true, autoIncrement: true },
	Product_BOM_ID: { type: BIGINT },
	Product_ID: { type: BIGINT },
	Quantity_Product: { type: FLOAT },
	Materials_ID: { type: BIGINT },
	Quantity_Material: { type: FLOAT },
	Mold_ID: { type: BIGINT },
	Process_ID: { type: BIGINT },
	Cavity: { type: INTEGER },
	Cycle_Time: { type: FLOAT },
	BOM_His: { type: BIGINT },
	Time_Created: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Created') } },
	User_Created: { type: BIGINT },
	Time_Updated: { type: DATE, get() { return getDateTimeFormat.call(this, 'Time_Updated') } },
	User_Updated: { type: BIGINT },
	IsDelete: { type: BOOLEAN, allowNull: false, defaultValue: false },
}, {
	tableName: 'Master_BOM',
	timestamps: true,
	createdAt: 'Time_Created',
	updatedAt: 'Time_Updated',
	hasTrigger: true
})

Model.hasOne(MasterProduct, {
	as: 'product',
	sourceKey: 'Product_BOM_ID',
	foreignKey: 'ID'
})

Model.hasOne(MasterMaterial, {
	as: 'materials',
	sourceKey: 'Materials_ID',
	foreignKey: 'ID'
})

Model.hasOne(MasterMold, {
	as: 'mold',
	sourceKey: 'Mold_ID',
	foreignKey: 'ID'
})

module.exports = Model