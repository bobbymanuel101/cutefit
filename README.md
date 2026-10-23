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
