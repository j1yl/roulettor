import React from "react";
import Auth from "./Auth";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 p-4">
      <div className="flex w-full items-center gap-2">
        <Link href="/" className="text-2xl font-bold">
          roulettor.com
        </Link>
        <div className="ml-4 flex justify-center gap-4">
          <Link href="/" className="navlink">
            home
          </Link>
          <Link href="/roulette" className="navlink">
            roulette
          </Link>
          <Link href="/faq" className="navlink">
            faq
          </Link>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Auth />
      </div>
    </nav>
  );
};

export default Navbar;
