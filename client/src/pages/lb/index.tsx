import type { User } from "@prisma/client";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { env } from "~/env.mjs";

interface Props {
  users: User[];
}

interface Response {
  data: Props;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const res: Response = await axios.get(`${env.NEXTAUTH_URL}/api/lb`);
  return {
    props: res.data,
  };
};

const Leaderboard: NextPage<Props> = ({ users }) => {
  return (
    <>
      <Head>
        <title>Roulettor.com</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex max-w-6xl overflow-x-auto p-2">
        <table className="table w-full">
          <thead>
            <tr>
              <th>RANK</th>
              <th>AVATAR</th>
              <th>BALANCE</th>
              <th>ID</th>
              <th>TAG</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <th>#{i + 1}</th>
                <td className="avatar">
                  <div className="mask mask-circle h-10 w-10">
                    <Image
                      src={u.image !== null ? u.image : ""}
                      alt={`${u.id} avatar`}
                      width={500}
                      height={500}
                    />
                  </div>
                </td>
                <td>{u.balance}</td>
                <td>{u.id}</td>
                <td>
                  {u.email?.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Leaderboard;
