import { UserProvider } from "./context/UserContext";
import "./globals.css";
import LayoutClient from "./layout-client";

export const metadata = {
  title: {
    default: "عقاراتك | موقع إدارة العقارات",
  },
  description: "نظام متكامل لإدارة وبيع وتأجير العقارات.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="myblue">
      <head />
      <body className="bg-white text-blue-900">
        <UserProvider>
          <LayoutClient>{children}</LayoutClient>
        </UserProvider>
      </body>
    </html>
  );
}
