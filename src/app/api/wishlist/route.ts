import { connection } from "next/server";
import { runAction } from "@/lib/actions/result";
import { serverApi } from "@/lib/api/server";

export async function GET() {
  await connection();
  return Response.json(await runAction(() => serverApi.wishlist.get()));
}
