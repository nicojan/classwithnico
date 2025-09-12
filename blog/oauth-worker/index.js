export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/auth") {
      const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
      authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set("scope", "repo,user");
      authorizeUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);
      return Response.redirect(authorizeUrl.toString(), 302);
    }
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      // Exchange code for token
      const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code
        })
      });
      const json = await tokenResp.json();
      if (!json.access_token) {
        return new Response(JSON.stringify(json), { status: 400 });
      }
      // Decap CMS expects { token: "..." }
      return new Response(JSON.stringify({ token: json.access_token }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("OK");
  }
}
