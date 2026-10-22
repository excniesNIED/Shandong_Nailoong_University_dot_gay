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

const CLI_UA =
  /curl|wget|httpie|python-requests|go-http-client|libwww|node-fetch|^node$|^undici$/i;

/**
 * Terminals get the ASCII art, everything else gets the page.
 *
 * The split is deliberately conservative: only clients that cannot render
 * HTML ask for it (`Accept: text/plain`) or identify as a command-line tool.
 * Crawlers that send a wildcard Accept (bingbot, Baidu, Yandex) must still see
 * the indexable HTML, otherwise a URL in the sitemap answers with plain text.
 */
function wantsAscii(request) {
  const accept = request.headers.get("Accept") || "";
  if (accept.includes("text/html")) return false;
  if (accept.includes("text/plain")) return true;
  return CLI_UA.test(request.headers.get("User-Agent") || "");
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

/**
 * GET /78: terminals get the ASCII art; browsers and crawlers get the
 * prerendered /78 page served in place. `env.ASSETS` keeps the URL on /78 so
 * the client router matches it and Umami records a /78 pageview — a redirect
 * would rewrite the URL to "/" and lose the easter egg. Serving HTML in place
 * also keeps the sitemap URL indexable: it answers 200 with a canonical and
 * a title instead of plain text.
 */
export async function onRequestGet({ request, env }) {
  if (wantsAscii(request)) return artResponse(request);
  return env.ASSETS.fetch(new URL("/78.html", request.url));
}

export const onRequestHead = onRequestGet;
