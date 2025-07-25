import Image from "next/image";
import Navigation from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Sidebar from "@/components/layout/Sidebar";
import UserMM from "@/components/modal/UserPermissionsContainer"

export default function Home() {
  return (
    <div>
      <Navigation />
      <Footer />
      <Sidebar />
      <UserMM/>
    </div>
  );
}
