module.exports = (db) => {
  return db.query('CREATE TABLE IF NOT EXISTS users(\
    user_id SERIAL PRIMARY KEY, \
    username VARCHAR(80) UNIQUE \
    );')    
  .then(() => {
  return db.query('CREATE TABLE IF NOT EXISTS address(\
    address_id SERIAL PRIMARY KEY, \
    full_address VARCHAR(500) NOT NULL, \
    user_id INTEGER REFERENCES users (user_id) \
    );')    
  })
  .catch((error) => {
    console.log('There is an error: ', error);
  });
};


