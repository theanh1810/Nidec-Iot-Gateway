const { DataTypes } = require('sequelize')
const { Db, getDateTimeFormat } = require('./Db')

const { BIGINT, STRING, DATE, BOOLEAN } = DataTypes

const Model = Db.define('User', {
    id:                { type: BIGINT, primaryKey: true, autoIncrement: true },
    name:              { type: STRING, allowNull: false },
    username:          { type: STRING, allowNull: false },
    email:             { type: STRING, allowNull: false },
    email_verified_at: { type: DATE, get() { return getDateTimeFormat.call(this, 'email_verified_at') } },
    password:          { type: STRING },
    api_token:         { type: STRING },
    software:          { type: STRING },
    level:             { type: BIGINT, allowNull: false },
    avatar:            { type: STRING, allowNull: false },
    IsDelete:          { type: BOOLEAN, allowNull: false },
    remember_token:    { type: STRING },
    cache:             { type: BOOLEAN, allowNull: false },
    created_at:        { type: DATE, get() { return getDateTimeFormat.call(this, 'created_at') } },
    updated_at:        { type: DATE, get() { return getDateTimeFormat.call(this, 'updated_at') } },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = Model