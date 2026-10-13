const MAMA_ART = `      妈                                        妈
      妈        妈妈妈妈妈妈妈妈              妈妈      妈妈妈妈妈妈妈妈
    妈妈                    妈妈              妈                      妈
妈妈  妈妈妈妈    妈妈      妈妈        妈妈妈  妈妈妈妈  妈妈        妈
  妈妈    妈妈    妈        妈              妈妈    妈妈  妈妈        妈
  妈妈    妈妈    妈        妈              妈      妈    妈妈      妈妈
  妈      妈    妈妈妈妈妈妈妈妈妈妈      妈妈    妈妈    妈妈妈妈妈妈妈妈妈
妈妈妈    妈                    妈妈      妈妈    妈妈                  妈妈
    妈妈妈妈                    妈妈        妈妈妈妈                      妈
      妈妈妈  妈妈妈妈妈妈妈妈  妈              妈妈妈  妈妈妈妈妈妈妈妈妈妈
    妈妈                        妈          妈妈    妈妈                妈妈
妈妈妈                    妈妈妈妈        妈妈                      妈妈妈
妈                        妈妈                                      妈妈

      妈                                        妈
      妈        妈妈妈妈妈妈妈妈              妈妈      妈妈妈妈妈妈妈妈
    妈妈                    妈妈              妈                      妈
妈妈  妈妈妈妈    妈妈      妈妈        妈妈妈  妈妈妈妈  妈妈        妈
  妈妈    妈妈    妈        妈              妈妈    妈妈  妈妈        妈
  妈妈    妈妈    妈        妈              妈      妈    妈妈      妈妈
  妈      妈    妈妈妈妈妈妈妈妈妈妈      妈妈    妈妈    妈妈妈妈妈妈妈妈妈
妈妈妈    妈                    妈妈      妈妈    妈妈                  妈妈
    妈妈妈妈                    妈妈        妈妈妈妈                      妈
      妈妈妈  妈妈妈妈妈妈妈妈  妈              妈妈妈  妈妈妈妈妈妈妈妈妈妈
    妈妈                        妈          妈妈    妈妈                妈妈
妈妈妈                    妈妈妈妈        妈妈                      妈妈妈
妈                        妈妈                                      妈妈`;

const BROWSER_UA =
  /Mozilla|Chrome|Safari|Firefox|Edg|OPR|Opera|MSIE|Trident|AppleWebKit|Gecko/i;

/**
 * Browser visit → frontend.
 * curl / wget / nc-style clients → plain-text ASCII art.
 */
function isBrowser(request) {
  const ua = request.headers.get("User-Agent") || "";
  const accept = request.headers.get("Accept") || "";
  const secFetchMode = request.headers.get("Sec-Fetch-Mode");

  // Explicit CLI clients
  if (/curl|wget|httpie|python-requests|Go-http-client|libwww|fetch/i.test(ua)) {
    return false;
  }

  // Modern browsers send Sec-Fetch-*
  if (secFetchMode === "navigate" || secFetchMode === "nested-navigate") {
    return true;
  }

  // Prefer HTML and look like a browser
  if (BROWSER_UA.test(ua) && accept.includes("text/html")) {
    return true;
  }

  // Bare browser UA without Accept (some tools)
  if (BROWSER_UA.test(ua) && !accept) {
    return true;
  }

  return false;
}

/**
 * Only `/78` and `/78/` reach this script (`assets.run_worker_first` in
 * wrangler.toml); every other path is served from the built frontend.
 */
export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: "GET, HEAD, OPTIONS",
        },
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed\n", {
        status: 405,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Allow: "GET, HEAD, OPTIONS",
        },
      });
    }

    // Browser → frontend home page
    if (isBrowser(request)) {
      return Response.redirect(new URL("/", request.url).toString(), 302);
    }

    // curl https://91.sbnu.gay/78
    const body = request.method === "HEAD" ? null : MAMA_ART + "\n";
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
