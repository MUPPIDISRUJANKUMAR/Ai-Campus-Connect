import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../src/contexts/AuthContext";
import EventsPage from "../src/components/events/EventsPage";
import { Navbar } from "../src/components/layout/Navbar";
import { Sidebar } from "../src/components/layout/Sidebar";
import { Notifications } from "../src/components/notifications/Notifications";
import { useState } from "react";

export default function EventsPageRoute() {
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
        <title>Events - Alumni Network</title>
      </Head>
      <div className="min-h-screen bg-background">
        <Navbar 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} 
        />
        <div className="flex">
          <Sidebar 
            currentView="events" 
            isMobileSidebarOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
          />
          <main className={`flex-1 p-8 ${isMobileSidebarOpen ? 'ml-64' : ''} md:ml-64`}>
            <EventsPage />
          </main>
          {isAuthenticated && <Notifications />}
        </div>
      </div>
    </>
  );
}
