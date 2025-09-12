# OAuth Worker for Decap CMS (GitHub backend)
This Worker handles GitHub OAuth for Decap CMS when you're not on Netlify.
1) Create a GitHub OAuth App:
   - Homepage URL: https://blog.example.com
   - Authorization callback URL: https://oauth.example.com/callback
2) Put the Client ID/Secret into Worker secrets:
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
3) Deploy the Worker and set your Decap CMS `base_url` to its domain (e.g., https://oauth.example.com)
