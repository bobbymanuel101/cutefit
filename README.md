# CuteFit

## Run on your computer
npm install
npm run dev

## Deploy to Netlify
1. Push this folder to a GitHub repo.
2. Netlify: Add new site > Import an existing project > pick the repo (build settings come from netlify.toml).
3. Site configuration > Environment variables: add GEMINI_API_KEY (free, from aistudio.google.com/apikey), then redeploy.

The AI features use Google Gemini's free tier when GEMINI_API_KEY is set. To use Claude instead,
remove GEMINI_API_KEY and add ANTHROPIC_API_KEY (paid, from console.anthropic.com).
Optional: GEMINI_MODEL or ANTHROPIC_MODEL to pin a specific model.

Without a key the app still works, but meal estimates, food ideas, workout builder and the AI coach won't.

## Login (switched off until you set it up)
The app runs without login until both Supabase settings exist in Netlify.
1. Create a project at supabase.com (pick an EU region). In Authentication, keep Email sign-in and "Confirm email" on.
2. Authentication > URL configuration: Site URL https://cutefit.netlify.app, and add http://localhost:5173 as a redirect URL.
3. SQL Editor: run supabase/schema.sql once (saves each person's data online, privately).
4. Netlify > Site configuration > Environment variables, add:
   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (Project Settings > API), and
   SUPABASE_SERVICE_ROLE_KEY (needed for "Delete my account"; keep it secret, never put it in the code).
   Then redeploy.
5. Fill in the [square brackets] in public/privacy/index.html and public/terms/index.html first.
6. Supabase's built-in email sender is for testing only. Set up your own email provider before launch.
The first person to log in on a phone takes over the data saved there before login existed.

## Move well
Shows "Coming soon" until at least one exercise in src/movewell/moveWellContent.js has approved: true.
To preview it on your phone, open https://cutefit.netlify.app/?mwpreview=1 once (?mwpreview=0 turns it off).
A physiotherapist must write and sign off every exercise before setting approved: true.
