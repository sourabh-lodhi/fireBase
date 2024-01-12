import "./globals.css";
import { Inter } from "next/font/google";
import "@progress/kendo-theme-default/dist/all.css";
import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Poker Boss",
  description: "Backoffice for poker boss",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
