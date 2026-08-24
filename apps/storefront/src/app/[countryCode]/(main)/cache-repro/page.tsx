import { getCachedCmsContent } from "@lib/cache-repro"

export const dynamic = "force-dynamic"

export default async function CacheReproPage() {
  const content = await getCachedCmsContent()

  return (
    <div className="content-container py-12">
      <h1 className="text-2xl-semi mb-4">Tag invalidation repro</h1>
      <p className="mb-6 text-ui-fg-subtle">
        This page is dynamically rendered. The timestamp below comes from{" "}
        <code>unstable_cache</code> tagged <code>cms-home</code>. It should stay
        the same on refresh until you invalidate the tag.
      </p>
      <dl className="grid gap-2 font-mono text-sm">
        <div>
          <dt className="text-ui-fg-muted">generatedAt</dt>
          <dd data-testid="generated-at">{content.generatedAt}</dd>
        </div>
        <div>
          <dt className="text-ui-fg-muted">instanceId (cache miss isolate)</dt>
          <dd>{content.instanceId}</dd>
        </div>
      </dl>
    </div>
  )
}
