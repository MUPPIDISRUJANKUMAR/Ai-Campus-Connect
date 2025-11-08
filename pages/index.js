export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}

export default function Home() {
  // This component never renders because of the server-side redirect, but Next requires a default export.
  return null;
}
