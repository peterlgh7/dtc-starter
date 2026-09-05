import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

const MAX_BLOB_LENGTH = 10_000_000;

function firstValue(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

function parseNonNegativeInt(
  value: unknown,
  field: string
): { ok: true; value?: number } | { ok: false; message: string } {
  const raw = firstValue(value);
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true };
  }

  const parsed = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return { ok: false, message: `${field} must be a non-negative integer` };
  }

  return { ok: true, value: parsed };
}

function parseSync(value: unknown): { ok: true; value: boolean } | { ok: false; message: string } {
  const raw = firstValue(value);
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, value: false };
  }

  if (typeof raw === "boolean") {
    return { ok: true, value: raw };
  }

  const normalized = String(raw).toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "sync") {
    return { ok: true, value: true };
  }
  if (normalized === "false" || normalized === "0" || normalized === "async") {
    return { ok: true, value: false };
  }

  return { ok: false, message: "sync must be true, false, sync, or async" };
}

function createBlob(length: number): string {
  return "x".repeat(length);
}

function delaySync(ms: number) {
  const end = process.hrtime.bigint() + BigInt(ms) * 1_000_000n;
  let sink = 0;
  while (process.hrtime.bigint() < end) {
    sink++;
  }
  void sink;
}

function delayAsync(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function handleDummy(req: MedusaRequest, res: MedusaResponse) {
  const lengthResult = parseNonNegativeInt(req.query.length, "length");
  if (!lengthResult.ok) {
    res.status(400).json({ message: lengthResult.message });
    return;
  }

  const delayResult = parseNonNegativeInt(req.query.delay, "delay");
  if (!delayResult.ok) {
    res.status(400).json({ message: delayResult.message });
    return;
  }

  const syncResult = parseSync(req.query.sync);
  if (!syncResult.ok) {
    res.status(400).json({ message: syncResult.message });
    return;
  }

  const length = lengthResult.value ?? 0;

  if (length > MAX_BLOB_LENGTH) {
    res.status(400).json({
      message: `length must be at most ${MAX_BLOB_LENGTH}`,
    });
    return;
  }

  const delay = delayResult.value ?? 0;
  if (delay > 0) {
    if (syncResult.value) {
      delaySync(delay);
    } else {
      await delayAsync(delay);
    }
  }

  res.json({ blob: createBlob(length) });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  await handleDummy(req, res);
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  await handleDummy(req, res);
}
