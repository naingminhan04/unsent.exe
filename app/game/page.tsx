import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, readSessionValue } from "../../lib/session";
import Home from "../page";

export default function GamePage() {
  const session = readSessionValue(cookies().get(SESSION_COOKIE)?.value);
  if (!session) redirect("/");

  return <Home />;
}
