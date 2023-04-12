import React from "react";
import Auth from "./Auth";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 p-2">
      <div>
        <Link href="/">Gamblo</Link>
      </div>
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/roulette">Roulette</Link>
        <Link href="/faq">FAQ</Link>
      </div>
      <div>
        <Auth />
      </div>
    </nav>
  );
};

export default Navbar;
