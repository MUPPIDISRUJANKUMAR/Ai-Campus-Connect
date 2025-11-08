import Head from "next/head";
import { AlumniDiscovery } from "../src/components/discover/AlumniDiscovery.tsx";
export default function Page() {
  return (
    <>
      <Head>
        <title>AlumniDiscovery</title>
      </Head>
      <div style={{ padding: 10 }}>
        <AlumniDiscovery />
      </div>
    </>
  );
}
