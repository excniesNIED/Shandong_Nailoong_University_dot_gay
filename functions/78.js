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

function artResponse(request) {
  const body = request.method === "HEAD" ? null : MAMA_ART + "\n";
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** GET /78: browsers go to the frontend, CLI clients get the ASCII art. */
export async function onRequestGet({ request }) {
  if (isBrowser(request)) {
    return Response.redirect(new URL("/", request.url).toString(), 302);
  }
  return artResponse(request);
}

export const onRequestHead = onRequestGet;
