import Roulette from "@/components/Roulette";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen top-0 left-0 absolute w-full">
      <Roulette />
      <p>info</p>
    </div>
  );
};

export default page;
