import { NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionValue } from "../../../lib/session";

const correctAnswers = [0, 2, 1];

export async function POST(request: Request) {
  const body = (await request.json()) as {
    questionIndex?: number;
    answerIndex?: number;
    answers?: number[];
    nickname?: string;
  };

  const questionIndex = body.questionIndex;
  const answerIndex = body.answerIndex;
  const correct = typeof questionIndex === "number" && answerIndex === correctAnswers[questionIndex];

  if (Array.isArray(body.answers) && body.answers.length >= correctAnswers.length) {
    const nickname = typeof body.nickname === "string" ? body.nickname.trim().slice(0, 32) : "";
    const response = NextResponse.json({ ok: true, correct });
    response.cookies.set(SESSION_COOKIE, createSessionValue(nickname), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ ok: true, correct });
}
