import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4 flex gap-4 flex-col md:items-center">
      <h1 className="text-5xl font-bold">Casino Games For Fun</h1>
      <p>
        Built by a{" "}
        <Link
          href="https://www.joelee.info"
          target="_blank"
          referrerPolicy="no-referrer"
          className="underline"
        >
          software engineer
        </Link>{" "}
        who loves to play roulette but hates losing money.
      </p>
      <div className="flex gap-2 md:item-center">
        <Button asChild>
          <Link href="/roulette">Play Now</Link>
        </Button>
        <Button asChild variant={"secondary"}>
          <Link
            href="https://github.com/j1yl/roulettor/"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            View Source
          </Link>
        </Button>
      </div>
      <Image
        src={"/dice.png"}
        alt="dice"
        width={1280}
        height={720}
        className="md:w-2/3 mt-16 md:mt-0"
      />
    </main>
  );
}
