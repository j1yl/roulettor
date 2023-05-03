import React from "react";
import Link from "next/link";
import Pouch from "./Pouch";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/roulette">Roulette</Link>
            </li>
            <li>
              <Link href="/dice">Dice</Link>
            </li>
            <li>
              <Link href="/lb">Leaderboard</Link>
            </li>
            <li>
              {session?.user ? (
                <button onClick={() => void signOut()}>Logout</button>
              ) : (
                <Link href={"/auth/signin"}>Login</Link>
              )}
            </li>
          </ul>
        </div>
        <Link
          className="btn-ghost btn text-xl normal-case text-primary"
          href="/"
        >
          Roulettor.com
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/roulette">Roulette</Link>
          </li>
          <li>
            <Link href="/dice">Dice</Link>
          </li>
          <li>
            <Link href="/lb">Leaderboard</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-0 md:gap-4">
        <Pouch />
        {session?.user ? (
          <button
            onClick={() => void signOut()}
            className="btn-primary btn hidden md:flex"
          >
            Logout
          </button>
        ) : (
          <Link
            href={"/auth/signin"}
            className="btn-primary btn hidden md:flex"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
