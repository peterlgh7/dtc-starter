import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

const IPIFY_URL = "https://api.ipify.org?format=json";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const response = await fetch(IPIFY_URL, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      res.status(502).json({
        message: "Failed to resolve egress IP",
      });
      return;
    }

    const data = (await response.json()) as { ip: string };

    res.json({
      ip: data.ip,
    });
  } catch {
    res.status(502).json({
      message: "Failed to resolve egress IP",
    });
  }
}
