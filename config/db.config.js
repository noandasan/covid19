const env = require('./env.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('../model/users.model.js')(sequelize, Sequelize);
db.Modules = require('../model/modules.model.js')(sequelize, Sequelize);
db.Roles = require('../model/roles.model.js')(sequelize, Sequelize);
db.Roleassigments = require('../model/roleassigments.model.js')(sequelize, Sequelize);
db.Controlassigments = require('../model/controlassigments.model.js')(sequelize, Sequelize);
db.Controls = require('../model/controls.model.js')(sequelize, Sequelize);
db.Countries = require('../model/countries.model.js')(sequelize, Sequelize);
db.Locations = require('../model/locations.model.js')(sequelize, Sequelize);

module.exports = db;