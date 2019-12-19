const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    define:{freezeTableName:true, timestamps: false},
   
	pool: {
	  max: config.database.pool.max,
	  min: config.database.pool.min,
	  acquire: config.database.pool.acquire,
	  idle: config.database.pool.idle
	}
  });

const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models/tables
db.customers = require('../model/customer.model.js')(sequelize, Sequelize);
db.itcust = require('../model/itcust.model.js')(sequelize, Sequelize);
 
 
module.exports = db;