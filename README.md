## Next.js App Router Course - Starter (Modified)

This is a modified version of the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application with some important changes:

### Key Modifications:
- The original tutorial uses Vercel's postgres package, which does not work locally.
- This version replaces it with the standard `pg` Node.js library for PostgreSQL connectivity.
- A `docker-compose.yml` file is included as an optional method to run PostgreSQL.

These changes allow for local development and testing without relying on Vercel-specific packages.

### Local Development Setup
You can either install PostgreSQL directly on your system or use the provided Docker Compose file to run PostgreSQL in a container.

#### Using Docker Compose
If you choose not to install PostgreSQL on your host machine:

1. Ensure you have Docker installed on your system.
2. Run the following command to start the PostgreSQL database:
   ```
   docker-compose up -d
   ```
3. The database will be available at `localhost:5432` with the following credentials:
   - Username: app_user
   - Password: password
   - Database: web_app

To stop the database, run:
```
docker-compose down
```

### Configuring the Application
1. Update your `.env` file with the appropriate database connection details.
2. Run your Next.js application as usual.

For more information on the original course, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.
