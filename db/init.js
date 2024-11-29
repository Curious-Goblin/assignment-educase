const db = require('./connection');

const createTableQuery = `
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);
`;

db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Database and table created or already exist.');
    db.end();
});
