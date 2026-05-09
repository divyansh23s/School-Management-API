const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
    try {
        console.log(`Connecting to ${process.env.MYSQLHOST} on port ${process.env.MYSQLPORT || 3306}...`);
        console.log(`Using Database: ${process.env.MYSQLDATABASE}`);

        const connection = await mysql.createConnection({
            host: process.env.MYSQLHOST,
            port: process.env.MYSQLPORT || 3306,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            ssl: { rejectUnauthorized: false }
        });

        const query = `
        CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL
        );`;

        console.log('Running query to create table...');
        await connection.execute(query);
        console.log('Success! The `schools` table is now ready on your database.');
        await connection.end();
        process.exit(0);
    } catch (e) {
        console.error('Database connection failed!', e.message);
        process.exit(1);
    }
}
setup();
