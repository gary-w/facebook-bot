const pgp = require('pg-promise')();
const schema = require('./schema.js');

// Create connection string
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chatbot'
// Create database
const db = pgp(connectionString);

const loadDb = (database) => {
  return schema(database);
};

loadDb(db)
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch(() => {
    console.error('Error connecting to database.');
  });

module.exports = { db, loadDb };

