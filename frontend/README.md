# MERN-ChatAPP Frontend

This is the frontend of the chat app. It uses NextJS(React).

## Setup Environment Variables

**1. Generate the `NEXTAUTH_SECRET` using the following command:**

```sh
openssl rand -base64 32
```

**2. Create a Google OAuth App for authentication:**

Follow the following documentation by Google to setup a OAuth App: [Google Documentation](https://support.google.com/cloud/answer/6158849?hl=en)

**3. Now create a .env file and populate it as follows:**

```env
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<SEE_ABOVE>
SERVER_URL=http://localhost:8000
```

> [!NOTE]
> If you changed the `PORT` environment variable inside the backend, make sure to change the port here aswell for the `SERVER_URL`

## Install Dependencies

- **npm:**

```sh
npm i
```

- **pnpm:**

```sh
pnpm i
```

## Start Server

Finally you can start the server with:

- **npm:**

```sh
npm run build
npm run start
```

- **pnpm:**

```sh
pnpm build
pnpm start
```
