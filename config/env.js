const env = {
  database: 'covid19',
  username: 'covid19',
  password: 'covid19',
  host: '94.97.246.47',
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
