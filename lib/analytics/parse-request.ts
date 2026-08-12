// lib/analytics/parse-request.ts
//
// Parsing leve, sem dependência externa. Cobre os casos comuns o
// suficiente pro dashboard; se um dia precisar de precisão maior,
// trocar por "ua-parser-js" é uma troca isolada, só aqui.

export function parseUserAgent(ua: string | null) {
  if (!ua) return { browser: "unknown", os: "unknown" };

  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /chrome\//i.test(ua)
    ? "Chrome"
    : /firefox\//i.test(ua)
    ? "Firefox"
    : /safari\//i.test(ua) && !/chrome/i.test(ua)
    ? "Safari"
    : "Other";

  const os = /windows/i.test(ua)
    ? "Windows"
    : /mac os/i.test(ua)
    ? "macOS"
    : /android/i.test(ua)
    ? "Android"
    : /iphone|ipad|ios/i.test(ua)
    ? "iOS"
    : /linux/i.test(ua)
    ? "Linux"
    : "Other";

  return { browser, os };
}

const KNOWN_SOURCES: Array<{ match: RegExp; source: string }> = [
  { match: /linkedin\.com/i, source: "linkedin" },
  { match: /github\.com/i, source: "github" },
  { match: /google\./i, source: "google" },
  { match: /t\.co|twitter\.com|x\.com/i, source: "twitter" },
];

export function classifyReferrer(referrer: string | null): string {
  if (!referrer) return "direct";
  const found = KNOWN_SOURCES.find(({ match }) => match.test(referrer));
  return found?.source ?? "other";
}
