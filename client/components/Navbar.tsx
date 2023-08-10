"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  const { data: session } = useSession();

  return (
    <nav className="flex p-4 justify-between w-full items-center">
      <div className="flex">
        <h1>Roulettor</h1>
      </div>
      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/roulette">Roulette</Link>
        </li>
      </ul>
      {session?.user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </nav>
  );
};

export default Navbar;
