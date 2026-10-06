// Time-based ISR route to test OpenNext's background revalidation on Cloud.
// Once the 10s window passes, the next request is served STALE and queues a
// regeneration through the WORKER_SELF_REFERENCE binding. If the binding works,
// a later request returns a new generatedAt. If it's missing, generatedAt never
// changes and the logs show "No service binding for cache revalidation worker".
// It lives under /api so the middleware, which calls the Medusa backend, skips it.
export const revalidate = 10

export async function GET() {
  const generatedAt = new Date().toISOString()

  console.log("[isr-repro] render", { generatedAt })

  return Response.json({ generatedAt })
}
