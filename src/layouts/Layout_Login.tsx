import { Outlet } from "react-router-dom";
import Header_login from "../components/Header_login";
import Sidebar from "../components/Sidebar";
import useAuth from "@/api/useAuth";
import Loading from "@/components/Loading";

export default function Layout_Login() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header_login />
      <main className="flex">
        <Sidebar />
        <div className="ml-0 md:ml-40 w-full">
          <Outlet />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
