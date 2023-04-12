import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const rouletteData = {
    wheelNumbers: [
      { value: "0", color: "green" },
      { value: "00", color: "green" },
      { value: "1", color: "red" },
      { value: "2", color: "black" },
      { value: "3", color: "red" },
      { value: "4", color: "black" },
      { value: "5", color: "red" },
      { value: "6", color: "black" },
      { value: "7", color: "red" },
      { value: "8", color: "black" },
      { value: "9", color: "red" },
      { value: "10", color: "black" },
      { value: "11", color: "black" },
      { value: "12", color: "red" },
      { value: "13", color: "black" },
      { value: "14", color: "red" },
      { value: "15", color: "black" },
      { value: "16", color: "red" },
      { value: "17", color: "black" },
      { value: "18", color: "red" },
      { value: "19", color: "red" },
      { value: "20", color: "black" },
      { value: "21", color: "red" },
      { value: "22", color: "black" },
      { value: "23", color: "red" },
      { value: "24", color: "black" },
      { value: "25", color: "red" },
      { value: "26", color: "black" },
      { value: "27", color: "red" },
      { value: "28", color: "black" },
      { value: "29", color: "black" },
      { value: "30", color: "red" },
      { value: "31", color: "black" },
      { value: "32", color: "red" },
      { value: "33", color: "black" },
      { value: "34", color: "red" },
      { value: "35", color: "black" },
      { value: "36", color: "red" },
    ],
    bettingOptions: [
      { label: "Red", payout: 2, color: "red" },
      { label: "Black", payout: 2, color: "black" },
      { label: "Green", payout: 14, color: "green" },
    ],
  };

  if (req.method != "GET") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  res.status(200).json(rouletteData);
}
