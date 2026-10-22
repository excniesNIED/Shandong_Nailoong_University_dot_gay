/**
 * GET /404: the prerendered not-found page with a real 404 status.
 *
 * Cloudflare Pages serves dist/404.html with `200 OK` when the file is
 * requested directly, which is a soft 404 — Search Console reports it as an
 * indexable page that carries `noindex`. Answering the same document with
 * 404 keeps the status truthful for crawlers and still shows the page to
 * humans who land on /404.
 */
export async function onRequestGet({ request, env }) {
  const response = await env.ASSETS.fetch(new URL("/404.html", request.url));
  return new Response(response.body, {
    status: 404,
    statusText: "Not Found",
    headers: response.headers,
  });
}

export const onRequestHead = onRequestGet;
