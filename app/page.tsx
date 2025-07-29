import Image from "next/image";
import Navigation from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Sidebar from "@/components/layout/Sidebar";
import UserMM from "@/components/modal/UserPermissionsContainer"
import UserML from "@/components/modal/Confirmation"
import UserMLL from "@/components/modal/UnsavedChanges"
import UserMLLL from "@/components/modal/Delete"




export default function Home() {
  return (
    <div>
      <Navigation />
      <Footer />
      <Sidebar />
      <UserMM/>
      <UserML/>
      <UserMLL/>
      <UserMLLL/>
    </div>
  );
}
