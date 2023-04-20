import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { authOptions } from "~/server/auth";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
// import { prisma } from "~/server/db";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    // const existingUser = await prisma.user.findFirst({
    //   where: {
    //     id: session?.user.id,
    //   },
    // });

    // if (existingUser)
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers ?? [],
    },
  };
};

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Roulettor.com</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-16 flex flex-col items-center justify-center gap-8">
        <h1 className="menu-title">Welcome back, we&apos;ve missed you !</h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => void signIn(provider.id)}
              className="btn-base btn"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SignIn;
