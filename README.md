# Ai-Campus-Connect

A React + Vite TypeScript capstone project for student campus features (dashboard, chat, alumni discovery, profile management). Uses Firebase for auth, Firestore and storage, and Tailwind CSS for styling.

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Create a `.env.local` file in the project root and add your Firebase values (do NOT commit secrets):

Open a new file named `.env.local.example` for template and paste the variables shown in the "Environment variables" section below.

3. Run development server:

```powershell
npm run dev
# open http://localhost:5173
```

4. Build and preview production:

```powershell
npm run build
npm run preview
```

## Environment variables

Create a `.env.local` file at project root with the following variables. DO NOT commit your real Firebase keys into the repository; share them privately with teammates.

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

Windows (PowerShell) quick create example:

```powershell
"VITE_FIREBASE_API_KEY=your_api_key_here" | Out-File -FilePath .env.local -Encoding utf8 -Append
"VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com" | Out-File -FilePath .env.local -Encoding utf8 -Append
# repeat for remaining keys (or use a text editor to create the file)
```

## Project structure (key files)

- `src/main.tsx` - App entry
- `src/App.tsx` - Main application component and view switching
- `src/lib/firebase.ts` - Firebase initialization (reads from VITE\_ env vars)
- `vite.config.ts` - Vite configuration

## Running notes / common issues

- Use Node.js v18+ where possible.
- If port is busy, start dev server on a different port: `npm run dev -- --port 3000`.
- If Firebase auth or Firestore calls fail, double-check `.env.local` values and Firebase console rules.

## Contributing

- Do not commit `.env.local` or any file containing secrets.
- If you need to share environment structure, add an `.env.example` or document variables in README without real values.

## License

MIT
