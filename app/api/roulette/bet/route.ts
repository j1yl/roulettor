import axios, { AxiosError } from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  const { amount, color, userId } = body as {
    amount: number;
    color: string;
    userId: string;
  };

  if (!amount || !color || !userId) {
    return new Response("Missing data", {
      status: 400,
    });
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bet`,
      {
        amount: amount,
        color: color,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env
            .NEXT_PUBLIC_API_URL as string,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          secret: process.env.SECRET as string,
        },
      }
    );

    if (response.status === 201) {
      return new Response("Success", {
        status: 201,
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status) {
      const { error } = axiosError.response.data as {
        error: string;
      };

      return new Response(error, {
        status: axiosError.response.status,
      });
    }

    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
