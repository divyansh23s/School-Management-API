# School Management API

This is a Node.js Express server with MySQL database to manage school data.

## Features
- **Add School (POST `/api/addSchool`)**: Add a new school with address and geospatial data.
- **List Schools (GET `/api/listSchools`)**: List all schools sorted by geographic distance (Haversine formula) from a specified latitude and longitude.

## Prerequisites
- Node.js installed
- MySQL Server running 

## Setup & Running Locally

1. Create a database called `school_management` using your preferred MySQL client or by running the script in `src/db/schema.sql`.
2. Update the `.env` file with your MySQL credentials.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Testing
You can import the provided `School-Management-API.postman_collection.json` into Postman to test the endpoints.

## Live Deployment (Hosting)
For deploying to a live endpoint without a local MySQL server, you will need a managed MySQL database and an app host:
1. **Database:** Use services like [Aiven](https://aiven.io/mysql) or [TiDB Serverless](https://www.pingcap.com/tidb-serverless/) for a free-tier cloud MySQL database.
2. **Hosting:** Once you have the DB credentials, update them as Environment Variables on a hosting service like **Render** or **Vercel** pointing to your GitHub repository.
3. On Render, set the build command to `npm install` and start command to `npm start`.

## Deliverables Met
- Created Node.js APIs matching constraints.
- Used MySQL for database interactions.
- Input validation implemented with `zod`.
- Haversine geographic sorting implemented.
- Automatic creation and pushing to this GitHub repository.
- Postman Collection ready for importing.
