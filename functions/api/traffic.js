const DAY = 86_400_000;
const UTC8 = 8 * 60 * 60 * 1000;

/** UTC+8 midnight, matching Umami's Asia/Shanghai daily stats. */
function todayStart(time = Date.now()) {
  return Math.floor((time + UTC8) / DAY) * DAY - UTC8;
}

function count(input) {
  if (!Number.isSafeInteger(input) || input < 0) throw new Error("Invalid count");
  return input;
}

const UMAMI_BASE = "https://analytics.hxcn.dev";
const UMAMI_WEBSITE_ID = "adfff7bd-43d2-4e3b-a4f1-03507a152dec";
const UMAMI_SHARE_SLUG = "rrvsNFxUxX4gi88K";

async function loadStats(time) {
  const signal = AbortSignal.timeout(8000);
  async function get(path, token) {
    const headers = { Accept: "application/json" };
    if (token) {
      headers["x-umami-share-token"] = token;
      headers["x-umami-share-context"] = "1";
    }
    const response = await fetch(`${UMAMI_BASE}${path}`, { headers, signal, redirect: "manual" });
    if (!response.ok) throw new Error("Umami unavailable");
    const text = await response.text();
    if (text.length > 65536) throw new Error("Invalid response");
    return JSON.parse(text);
  }

  const share = await get(`/api/share/${UMAMI_SHARE_SLUG}`);
  if (
    share?.websiteId !== UMAMI_WEBSITE_ID ||
    typeof share.token !== "string" ||
    !share.token ||
    share.token.length > 16384 ||
    (share.shareType != null && share.shareType !== 1)
  ) {
    throw new Error("Invalid website share");
  }

  async function counts(start) {
    const query = new URLSearchParams({
      startAt: String(start),
      endAt: String(time),
      timezone: "Asia/Shanghai",
    });
    const data = await get(`/api/websites/${UMAMI_WEBSITE_ID}/stats?${query}`, share.token);
    return { visitors: count(data?.visitors), pageviews: count(data?.pageviews) };
  }

  const [today, total, active] = await Promise.all([
    counts(todayStart(time)),
    counts(0),
    get(`/api/websites/${UMAMI_WEBSITE_ID}/active`, share.token),
  ]);
  return {
    today,
    total,
    online: count(active?.visitors),
    updatedAt: new Date(time).toISOString(),
  };
}

/** Single-flight per UTC+8 day: fresh for 30s, failed state retried after 5s. */
function trafficService({ now = Date.now } = {}) {
  let cached;
  let flight;
  return async function traffic() {
    const time = now();
    const key = `${todayStart(time)}`;
    if (cached?.key === key && time < cached.until) {
      if (cached.failed) throw new Error("Umami unavailable");
      return cached.value;
    }
    if (flight?.key === key) return flight.promise;
    const current = { key };
    current.promise = loadStats(time)
      .then((value) => {
        cached = { key, value, until: Math.min(now() + 30_000, todayStart(time) + DAY) };
        return value;
      })
      .catch(() => {
        cached = { key, failed: true, until: Math.min(now() + 5000, todayStart(time) + DAY) };
        throw new Error("Umami unavailable");
      })
      .finally(() => {
        if (flight === current) flight = undefined;
      });
    flight = current;
    return current.promise;
  };
}

const getTraffic = trafficService();

/** GET /api/traffic: 今日浏览 / 总浏览 / 在线 from the Umami share API. */
export async function onRequestGet() {
  try {
    const data = await getTraffic();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "traffic unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}

export const onRequestHead = onRequestGet;
