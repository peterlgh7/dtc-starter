import { unstable_cache } from "next/cache"

export const CMS_CACHE_TAG = "cms-home"

const instanceId = crypto.randomUUID()

export const getCachedCmsContent = unstable_cache(
  async () => {
    const generatedAt = new Date().toISOString()

    console.log("[cache-repro] cache miss", { instanceId, generatedAt })

    return {
      instanceId,
      generatedAt,
    }
  },
  ["cms-home"],
  {
    tags: [CMS_CACHE_TAG],
  }
)
