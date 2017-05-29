const pgp = require('pg-promise')();
const schema = require('./schema.js');

// Create connection string
const connectionString = 'postgres://luceabsihwthuw:73b97bee32c0089548b0345ca408f6391676abbd700dbf4e9b0e549c0050fb08@ec2-54-163-246-154.compute-1.amazonaws.com:5432/daf0f5dr7q016m' || 'postgres://localhost:5432/chatbot'
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

