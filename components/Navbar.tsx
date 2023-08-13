"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {};

const Navbar = (props: Props) => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="flex my-16 justify-between w-full items-center">
      <div className="flex items-center">
        <ul className="flex items-center justify-center">
          <li>
            <Button variant={"link"} asChild>
              <Link href="/">
                <h1 className="font-bold text-2xl">Roulettor.com</h1>
              </Link>
            </Button>
          </li>
          <li className="hidden md:block">
            <Button asChild variant="link">
              <Link href="/roulette">Roll</Link>
            </Button>
          </li>
          <li className="hidden md:block">
            <Button asChild variant="link">
              <Link href="/lb">Leaderboard</Link>
            </Button>
          </li>
        </ul>
      </div>
      <Button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden block"
        variant={"link"}
      >
        Menu
      </Button>
      {isMenuOpen && (
        <>
          <nav className="fixed z-50 top-0 left-0 min-h-screen w-full flex flex-col items-center justify-evenly bg-background">
            <Button variant={"link"} onClick={() => setIsMenuOpen(false)}>
              Close Menu
            </Button>
            <Link
              href="/"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl underline font-bold"
            >
              Roulettor.com
            </Link>
            <ul className="flex flex-col items-center gap-8">
              <Link href="/roulette" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                Roll
              </Link>
              <Link href="/roulette" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                FAQ
              </Link>
            </ul>
            {session?.user && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="border-primary border">
                    <AvatarImage
                      src={session.user.image as string}
                      alt={`@${session.user.userId}`}
                    />
                    <AvatarFallback>
                      {session.user.name?.split(" ").filter((word) => word[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-1 text-xs flex-col justify-start items-start">
                    <span>@{session.user.userId}</span>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="w-4 h-4 fill-orange-500"
                      >
                        <path d="M451-193h55v-52q61-7 95-37.5t34-81.5q0-51-29-83t-98-61q-58-24-84-43t-26-51q0-31 22.5-49t61.5-18q30 0 52 14t37 42l48-23q-17-35-45-55t-66-24v-51h-55v51q-51 7-80.5 37.5T343-602q0 49 30 78t90 54q67 28 92 50.5t25 55.5q0 32-26.5 51.5T487-293q-39 0-69.5-22T375-375l-51 17q21 46 51.5 72.5T451-247v54Zm29 113q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                      </svg>
                      <span>{session?.user.balance}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {session?.user ? (
              <Button variant={"link"} onClick={() => signOut()}>
                Logout
              </Button>
            ) : (
              <Button variant={"link"} onClick={() => signIn()}>
                Login
              </Button>
            )}
          </nav>
        </>
      )}
      <div className="md:flex hidden items-center md:gap-4 text-xs">
        {session?.user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="border-primary border">
                <AvatarImage
                  src={session.user.image as string}
                  alt={`@${session.user.userId}`}
                />
                <AvatarFallback>
                  {session.user.name?.split(" ").filter((word) => word[0])}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-1 flex-col justify-start items-start">
                <span className="text-xs">@{session.user.userId}</span>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-4 h-4 fill-orange-500"
                  >
                    <path d="M451-193h55v-52q61-7 95-37.5t34-81.5q0-51-29-83t-98-61q-58-24-84-43t-26-51q0-31 22.5-49t61.5-18q30 0 52 14t37 42l48-23q-17-35-45-55t-66-24v-51h-55v51q-51 7-80.5 37.5T343-602q0 49 30 78t90 54q67 28 92 50.5t25 55.5q0 32-26.5 51.5T487-293q-39 0-69.5-22T375-375l-51 17q21 46 51.5 72.5T451-247v54Zm29 113q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                  </svg>
                  <span>{session?.user.balance}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {session?.user ? (
          <Button variant={"link"} onClick={() => signOut()}>
            Logout
          </Button>
        ) : (
          <Button variant={"link"} onClick={() => signIn()}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
