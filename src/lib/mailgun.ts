import "server-only";

export type SendEmailInput = { to: string; subject: string; html: string; text: string };
export type SendEmailResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

/**
 * Sends a transactional email through the Mailgun HTTP API.
 * Runs server-side only. Errors are logged here and never thrown to callers.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL;
  const baseUrl = process.env.MAILGUN_BASE_URL ?? "https://api.mailgun.net";

  if (!apiKey || !domain || !from) {
    console.error("[mailgun] Missing MAILGUN_API_KEY, MAILGUN_DOMAIN or MAILGUN_FROM_EMAIL");
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch(`${baseUrl}/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[mailgun] Send failed with status ${res.status}: ${body.slice(0, 300)}`);
      return { ok: false, reason: "failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mailgun] Send error:", err instanceof Error ? err.message : err);
    return { ok: false, reason: "failed" };
  }
}
