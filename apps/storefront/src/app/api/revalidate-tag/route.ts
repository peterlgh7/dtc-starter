import { CMS_CACHE_TAG } from "@lib/cache-repro"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const instanceId = crypto.randomUUID()

export async function GET(req: NextRequest) {
  return handleRevalidate(req)
}

export async function POST(req: NextRequest) {
  return handleRevalidate(req)
}

async function handleRevalidate(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path")

  console.log("[cache-repro] revalidate", {
    instanceId,
    tag: CMS_CACHE_TAG,
    path,
  })

  revalidateTag(CMS_CACHE_TAG)

  if (path) {
    revalidatePath(path)
  }

  return NextResponse.json({
    revalidated: true,
    tag: CMS_CACHE_TAG,
    path: path ?? null,
    instanceId,
    at: new Date().toISOString(),
  })
}
