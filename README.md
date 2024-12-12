
# Frontend Sistema para la Gestión de Servicios Automotrices (SISGOSA)

This project is a web application built with Next.js, leveraging Firebase for storage, and consuming an API. It is designed to provide a fast and interactive user experience.

---

## Installation

1. Clone this repository if you haven't already:
   ```bash
   git clone https://github.com/Jonathan-Vidrio/frontend-sisgosa.git
   ```

2. Navigate to the project directory:
   ```bash
   cd frontend-sisgosa
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   Create a `.env.local` file in the root directory and add the following configurations:
   ```
   # API
   HOST_URL=http://<API_HOST>:<API_PORT>/api/v1
   # PRIVATE_KEY used for encryption operations
   PRIVATE_KEY=some_private_key

   # Firebase
   API_KEY=some_api_key
   AUTH_DOMAIN=some_auth_domain
   PROJECT_ID=some_project_id
   STORAGE_BUCKET=some_storage_bucket
   MESSAGING_SENDER_ID=some_messaging_sender_id
   APP_ID=some_app_id
   ```

---

## Usage

- **Development mode**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3030) in your browser to see the application.

- **Build for production**:
  ```bash
  npm run build
  ```

- **Run the application in production**:
  ```bash
  npm start
  ```

---

## Available Scripts

- `dev`: Runs the server in development mode.
- `build`: Builds the application for production.
- `start`: Runs the compiled application in production mode.
- `lint`: Lints the code using ESLint.
- `format`: Formats the code using Prettier.
- `docs`: Generates documentation using Typedoc.

---

## Main Dependencies

- **Framework**: [Next.js](https://nextjs.org/) (v15.0.3)
- **React Libraries**: React (v19.0.0) and React DOM (v19.0.0)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- **Firebase**: For storage.
- **UUID**: For generating unique identifiers.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/).
- **Encryption**: [Jose](https://github.com/panva/jose).

---

## Styles

This project uses [Tailwind CSS](https://tailwindcss.com/) for rapid and flexible styling configuration.

---

## Documentation

The project documentation is auto-generated using **TypeDoc**. To generate the documentation, run:
```
npm run docs

-- launch the server in development mode
npm run dev
```

The generated documentation will be available in the `docs` directory.
```
http://localhost:3030/docs
```
