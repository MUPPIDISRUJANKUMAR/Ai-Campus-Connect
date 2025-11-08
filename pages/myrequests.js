import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../src/contexts/AuthContext";
import MyRequestsPage from "../src/components/myrequests/MyRequestsPage";
import { Navbar } from "../src/components/layout/Navbar";
import { Sidebar } from "../src/components/layout/Sidebar";
import { Notifications } from "../src/components/notifications/Notifications";
import { useState } from "react";

export default function MyRequestsPageRoute() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const handleViewChange = (view) => {
    router.push(`/${view}`);
  };

  return (
    <>
      <Head>
        <title>My Requests - Alumni Network</title>
      </Head>
      <div className="min-h-screen bg-background">
        <Navbar 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} 
        />
        <div className="flex">
          <Sidebar 
            currentView="myrequests" 
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
          />
          <main className={`flex-1 p-8 ${isMobileSidebarOpen ? 'ml-64' : ''} md:ml-64`}>
            <MyRequestsPage />
          </main>
          {isAuthenticated && <Notifications />}
        </div>
      </div>
    </>
  );
}
