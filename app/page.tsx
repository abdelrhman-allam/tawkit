import { decodeState } from "@/app/lib/url";
import HomeClient from "./components/HomeClient";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (!v) continue;
    if (Array.isArray(v)) {
      usp.set(k, v[0] ?? "");
    } else {
      usp.set(k, v);
    }
  }
  const initialState = decodeState(usp);
  return <HomeClient initialState={initialState} />;
}
