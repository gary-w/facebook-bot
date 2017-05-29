module.exports = (db) => {
  return db.query('CREATE TABLE IF NOT EXISTS users(\
    id SERIAL PRIMARY KEY, \
    usertoken VARCHAR(80) UNIQUE \
    );')    
  .then(() => {
  return db.query('CREATE TABLE IF NOT EXISTS todo(\
    id SERIAL PRIMARY KEY, \
    item VARCHAR(500) NOT NULL, \
    status BOOLEAN NOT NULL DEFAULT FALSE, \
    user_id INTEGER REFERENCES users (id) \
    );')    
  })
  .catch((error) => {
    console.log('There is an error: ', error);
  });
};


