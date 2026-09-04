import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
});

export type SubscribeResult = { ok: boolean; message: string };

export const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<SubscribeResult> => {
    const apiKey = process.env["BEEHIIV_API_KEY"];
    const publicationId = process.env["BEEHIIV_PUBLICATION_ID"];

    if (!apiKey || !publicationId) {
      return { ok: false, message: "Newsletter is not configured yet. Try again soon." };
    }

    try {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: "aiwire",
          }),
        },
      );

      if (!res.ok) {
        const body = await res.text();
        console.error(`beehiiv subscribe failed [${res.status}]: ${body}`);
        if (res.status === 409 || body.includes("already")) {
          return { ok: true, message: "You are already on the list." };
        }
        return { ok: false, message: "Could not subscribe right now. Please try again." };
      }

      return { ok: true, message: "Subscribed. Check your inbox." };
    } catch (error) {
      console.error("beehiiv subscribe error", error);
      return { ok: false, message: "Could not subscribe right now. Please try again." };
    }
  });
