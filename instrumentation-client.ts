import posthog from "posthog-js";

if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ph",
    ui_host: "https://us.posthog.com",
  });
}
