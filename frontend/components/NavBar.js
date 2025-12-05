NavBar.js


"use client";

import Link from "next/link";
import useAuth from "../lib/useAuth";

export default function NavBar() {
  const { customer } = useAuth();

  return (
    <nav className="w-full border-b border-glowGrey p-4 flex justify-between">
      <Link href="/" className="text-xl font-semibold">
        Glow AI
      </Link>

      <div className="flex gap-4">
        {customer ? (
          <Link href="/account" className="text-glowBlue">My Account</Link>
        ) : (
          <Link href="/login" className="text-glowBlue">Login</Link>
        )}
      </div>
    </nav>
  );
}
