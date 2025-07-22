'use client'; // Client Component
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import SessionWrapper from "@/Components/SessionWrapper";
import { usePathname } from 'next/navigation'; // Import the usePathname hook

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  return (
    <SessionWrapper>
      <div className="page-container">{/* Only show Navbar if the current route is NOT /Login */}
        {pathname !== '/Login' && pathname !== '/signup' && <Navbar isUsernamePage={true}/>}
        <div className="content flex-col">
          {children}
        </div>
        <Footer />
      </div>
    </SessionWrapper>
  );
}
