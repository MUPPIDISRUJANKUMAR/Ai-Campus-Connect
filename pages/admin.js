import Head from "next/head";
import { AdminDashboard } from "../src/components/admin/AdminDashboard.tsx";
export default function Page() {
  return (
    <>
      <Head>
        <title>AdminDashboard</title>
      </Head>
      <div style={{ padding: 10 }}>
        <AdminDashboard />
      </div>
    </>
  );
}
