require('dotenv').config()

module.exports = {
    "type": "postgres",
    "host": process.env.TYPEORM_HOST,
    "port": 5432,
    "username": process.env.TYPEORM_USERNAME,
    "password": process.env.TYPEORM_PASSWORD,
    "database": process.env.TYPEORM_DATABASE,
    "synchronize": true,
    "logging": false,
    "entities": [
       "src/entities/**/*.ts"
    ],
    "migrations": [
       "src/migrations/**/*.ts"
    ],
    "subscribers": [
       "src/subscribers/**/*.ts"
    ],
    "cli": {
       "entitiesDir": "src/entities",
       "migrationsDir": "src/migrations",
       "subscribersDir": "src/subscribers"
    }
 }