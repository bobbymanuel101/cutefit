# CuteFit

## Run on your computer
npm install
npm run dev

## Deploy to Netlify
1. Push this folder to a GitHub repo.
2. Netlify: Add new site > Import an existing project > pick the repo (build settings come from netlify.toml).
3. Site configuration > Environment variables: add ANTHROPIC_API_KEY (from console.anthropic.com), then redeploy.

Without the key the app still works, but meal estimates, food ideas, workout builder and the AI coach won't.
