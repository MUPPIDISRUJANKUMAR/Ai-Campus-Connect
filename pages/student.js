import Head from "next/head";
import { StudentDashboard } from "../src/components/dashboard/StudentDashboard.tsx";
export default function Page() {
  return (
    <>
      <Head>
        <title>StudentDashboard</title>
      </Head>
      <div style={{ padding: 10 }}>
        <StudentDashboard />
      </div>
    </>
  );
}
