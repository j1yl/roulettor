import Roulette from "@/components/Roulette";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 p-4 items-center justify-center w-full">
      <Roulette />
    </div>
  );
};

export default page;
