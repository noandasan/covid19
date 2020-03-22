const env = {
  database: 'smharabi_covid',
  username: 'smharabi_covid',
  password: 'Da&5]i2MWTPv',
  host: '108.179.237.41',
  dialect: 'mysql',
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};

module.exports = env;