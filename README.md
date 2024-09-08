## Next.js App Router Course - Starter (Modified)

This is a modified version of the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application with some important changes:

### Key Modifications:
- The original tutorial uses Vercel's postgres package, which does not work locally.
- This version replaces it with the standard `pg` Node.js library for PostgreSQL connectivity.
- A `docker-compose.yml` file is included to easily spin up a PostgreSQL database locally.

These changes allow for local development and testing without relying on Vercel-specific packages or requiring a local PostgreSQL installation.

### Local Development Setup
1. Ensure you have Docker and Docker Compose installed on your system.
2. Clone this repository to your local machine.
3. Navigate to the project directory in your terminal.
4. Run the following command to start the PostgreSQL database:
   ```
   docker-compose up -d
   ```
5. The database will be available at `localhost:5432` with the following credentials:
   - Username: app_user
   - Password: password
   - Database: web_app
6. Update your `.env` file with these database connection details.
7. Run your Next.js application as usual.

To stop the database, run:
```
docker-compose down
```

This setup simplifies the development process and ensures a consistent environment across different machines.

For more information on the original course, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.
