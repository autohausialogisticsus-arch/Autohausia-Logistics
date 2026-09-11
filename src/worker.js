const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === "/") path = "/index.html";
    else if (!path.endsWith(".html") && !path.includes(".")) {
      // Map clean URLs like /about to /about.html for server-rendered HTML
      const htmlPath = path.replace(/\/$/, "") + ".html";
      const htmlResp = await env.ASSETS.fetch(
        new Request(url.origin + htmlPath, { method: "GET" })
      );
      if (htmlResp.status === 200) return htmlResp;
    }
    return env.ASSETS.fetch(request);
  },
};

export default worker;