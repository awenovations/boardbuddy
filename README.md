## Running Locally

This can be run locally, with `npm run dev`, but you will need localhost env file:

```env
# OAuth for google on localhost
AUTH_GOOGLE_ID=<from console.cloud.google.com>
AUTH_GOOGLE_SECRET=<from console.cloud.google.com>
AUTH_GOOGLE_CALLBACK="http://localhost:5173/signin/providers/google/callback"

# Set to your mongodb url
MONGODB_URI=mongodb://localhost:27017/board-buddy

APPLE_CLIENT_ID=<for apple, only if deploying, locally can be anything>
APPLE_CLIENT_SECRET=<from apple>

# Keycloak is used even when OAuth is used, set the values below to your keycloak values
OAUTH_VALIDATION_URL=http://localhost:8080/auth/realms/boardbuddy/protocol/openid-connect/userinfo
OAUTH_CLIENT_URL=http://localhost:8080/auth/realms/boardbuddy
KEYCLOAK_ADMIN_API=http://localhost:8080/auth/admin/realms/boardbuddy
KEYCLOAK_REALM=boardbuddy
KEYCLOAK_CLIENT_ID=local
KEYCLOAK_CLIENT_SECRET=<your keycloak secret>
```

# BoardBuddy

A simplified kanban board designed to minimize complicated project management tasks. Perfect for scrum calls and keeping your workflow straightforward.

![Board Buddy Home Page Screenshot](./screenshot.png)

## Tech Stack

- **Framework**: SvelteKit
- **Database**: MongoDB
- **Authentication**: Keycloak + OAuth (Google, Apple)

## Running Locally

### Prerequisites

- Node.js
- MongoDB running on `localhost:27017`
- Keycloak running on `localhost:8080`

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# OAuth for Google on localhost
AUTH_GOOGLE_ID=<from console.cloud.google.com>
AUTH_GOOGLE_SECRET=<from console.cloud.google.com>
AUTH_GOOGLE_CALLBACK="http://localhost:5173/signin/providers/google/callback"

# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/board-buddy

# Apple OAuth (can be anything for local development)
APPLE_CLIENT_ID=<for apple, only if deploying, locally can be anything>
APPLE_CLIENT_SECRET=<from apple>

# Keycloak configuration
OAUTH_VALIDATION_URL=http://localhost:8080/auth/realms/boardbuddy/protocol/openid-connect/userinfo
OAUTH_CLIENT_URL=http://localhost:8080/auth/realms/boardbuddy
KEYCLOAK_ADMIN_API=http://localhost:8080/auth/admin/realms/boardbuddy
KEYCLOAK_REALM=boardbuddy
KEYCLOAK_CLIENT_ID=local
KEYCLOAK_CLIENT_SECRET=<your keycloak secret>

RESET_EMAIL_ADDRESS=<an email in mailgun>
MAILGUN_API_KEY=<mailgun api key>
```

### Start Development Server

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Notes

- Keycloak is used for authentication even when OAuth providers (Google, Apple) are configured
- For local development, Apple credentials can be set to any value—they're only required for production deployment
- Make sure MongoDB and Keycloak are running before starting the dev server
- Mailgun is for sending emails, password resets for right now

---

BoardBuddy** - Simplify your workflow 🚀
