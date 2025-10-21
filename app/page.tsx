import HomeClient from "./components/HomeClient";

export const dynamic = "force-static";

export default function Home() {
  // Static page; URL decoding is done client-side in HomeClient
  return <HomeClient initialState={null} />;
}
