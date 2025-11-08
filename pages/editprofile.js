import Head from "next/head";
import { EditProfileForm } from "../src/components/profile/EditProfileForm.tsx";
export default function Page() {
  return (
    <>
      <Head>
        <title>EditProfileForm</title>
      </Head>
      <div style={{ padding: 10 }}>
        <EditProfileForm />
      </div>
    </>
  );
}
