import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://448cede325be4e3199a09af0bc8da715@o1047646.ingest.sentry.io/6024712",
  tracesSampleRate: 1.0,
});

// Any PublicError we throw contains an error message that the user is allowed
// to see.
export class PublicError extends Error {}

// We use this to prevent logging while in development mode (and just log
// locally instead)
export function captureException(
  e: any,
  captureContext?: Parameters<typeof Sentry.captureException>[1]
) {
  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(e, captureContext);
  }

  console.log(e, captureContext);
}
