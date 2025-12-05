import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "../components/providers/AuthProvider";
import NavBar from "../components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Glow AI",
  description: "AI-powered booking automation for medspas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
