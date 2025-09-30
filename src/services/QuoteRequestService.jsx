// Sends quote requests to an n8n webhook.
// Configure: VITE_N8N_QUOTE_WEBHOOK_URL

export async function submitQuoteRequest(form) {
  const url = import.meta.env.VITE_N8N_QUOTE_WEBHOOK_URL;
  if (!url) {
    throw new Error("VITE_N8N_QUOTE_WEBHOOK_URL is not configured.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s safety timeout

  try {
    const payload = {
      ...form,
      _meta: {
        ts: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
      // Pass recaptchaToken if present
      recaptchaToken: form.recaptchaToken || undefined,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Webhook error: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
      );
    }

    // n8n often returns an echo or custom JSON; tolerate empty JSON
    return await res.json().catch(() => ({}));
  } finally {
    clearTimeout(timeoutId);
  }
}

// NEW: submit paused-intake waitlist email
export async function submitWaitlistEmail(email, extra = {}) {
  const url =
    import.meta.env.VITE_N8N_WAITLIST_WEBHOOK_URL ||
    import.meta.env.VITE_N8N_QUOTE_WEBHOOK_URL;

  if (!url) {
    throw new Error("VITE_N8N_WAITLIST_WEBHOOK_URL (or VITE_N8N_QUOTE_WEBHOOK_URL) is not configured.");
  }

  // accept both submitWaitlistEmail(email, extra) and submitWaitlistEmail({ email, ... })
  const input = (typeof email === "object" && email !== null)
    ? email
    : { email, ...extra };

  if (!input.email || typeof input.email !== "string") {
    throw new Error("Waitlist email is required.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const payload = {
      email: input.email,
      ...(() => {
        const { email: _e, ...rest } = input;
        return rest;
      })(), // includes name, acceptMarketing, recaptchaToken
      _type: "waitlist",
      _meta: {
        ts: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Webhook error: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
    }

    return await res.json().catch(() => ({}));
  } finally {
    clearTimeout(timeoutId);
  }
}