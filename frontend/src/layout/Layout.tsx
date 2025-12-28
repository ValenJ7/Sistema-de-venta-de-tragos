import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import DrinkDetailsModal from "../components/DrinkDetailsModal";
import Notification from "../components/Notification";
export function Layout() {
  const { pathname } = useLocation();



  return (
    <div className="min-h-screen bg-amber-50 text-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4  pb-10">
        <Outlet />
      </main>
      <DrinkDetailsModal />
      <Notification />
    </div>
  );
}
