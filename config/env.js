const env = {
  database: 'smharabi_covid',
  username: 'smharabi_covid',
  password: '.Cn;n]%n)ivP',
  host: '108.179.237.41',
  dialect: 'mysql',
	port: 3306
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};

module.exports = env;
