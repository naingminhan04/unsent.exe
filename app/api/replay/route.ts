import { NextResponse } from "next/server";

export function GET() {
  const value = process.env.UNSENT_REPLAY_UNLOCK?.trim().toLowerCase();
  return NextResponse.json({ unlocked: value === "true" || value === "1" || value === "yes" });
}
