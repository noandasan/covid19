const env = {
  database: 'db',
  username: 'user',
  password: 'pass',
  host: 'host',
  dialect: 'mysql',
	port: 3306,
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};
module.exports = env;
