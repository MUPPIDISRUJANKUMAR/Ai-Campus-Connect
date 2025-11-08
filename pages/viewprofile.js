import Head from "next/head";
import { ViewProfile } from "../src/components/profile/ViewProfile.tsx";
export default function Page() {
  return (
    <>
      <Head>
        <title>ViewProfile</title>
      </Head>
      <div style={{ padding: 10 }}>
        <ViewProfile />
      </div>
    </>
  );
}
