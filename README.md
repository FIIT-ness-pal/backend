### Prerequisites
- Node.js
- PostgreSQL

### Running the application
1. Create a PostgreSQL database.
2. Create .env file in /backend directory and fill the following variables with your credentials.
    ```
    TYPEORM_HOST = ...
    TYPEORM_USERNAME = ...
    TYPEORM_PASSWORD = ...
    TYPEORM_DATABASE = ...
    ACCESS_TOKEN_SECRET = ...
    TYPEORM_SEEDING_FACTORIES=src/factories//*{.ts,.js}
    TYPEORM_SEEDING_SEEDS=src/seeds//*{.ts,.js}
    ```
3. Run `npm install` to install all dependencies.
4. Run `npm run seed:run` to fill the database with seed data.
5. Run `npm start` to run the application.

### Notes
- With every request to the server you need to add 'Authorization' field to the request header together with JWT token.
- If you want to test the POST /userPhoto endpoint in Postman you need to add a **avatar** key
  - Body -> form-data -> key **avatar**, type **file** and select photo in the value column