import { ApiError, User } from "@supabase/supabase-js";
import { NextApiRequest, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  LinkBtn,
  WalletConnectBtn,
  WalletDeleteBtn,
} from "../components/Buttons";
import { Loader, NotLoggedInModal } from "../components/Modals";
import fetchWallet from "../utils/fetchWallet";
import getUserByCookie from "../utils/getUserByCookie";
import discordToWalletConnection from "../utils/ifcDiscordtoWalletConnection";
import { supabase } from "../utils/supabaseClient";

const Profile: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<discordToWalletConnection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setUser(await supabase.auth.user());
      setWallet(await fetchWallet());
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    // TODO make a modal that says "yo, not logged in, click here to log in"
    return <NotLoggedInModal />;
  }

  return (
    <div>
      <Head>
        <title>Your Profile</title>
        <meta
          name="description"
          content="A page to connect your discord account to your wallet."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
        <form>
          <div className="space-y-6">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">
                Your profile
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                You can see your profile and connect your wallet in here.
              </p>
            </div>

            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                Photo (from Discord)
              </label>
              <div className="mt-1 text-sm text-gray-500">
                <Image
                  className="inline-block h-12 w-12 rounded-full"
                  height={48}
                  width={48}
                  src={user.user_metadata.avatar_url}
                  alt="Your profile image sourced from Discord"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1 text-sm text-gray-500">
                {user.user_metadata.full_name}
              </div>
            </div>

            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 text-sm text-gray-500">{user.email}</div>
            </div>

            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <div className="mt-1 text-sm text-gray-500">{user.id}</div>
            </div>

            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700"
              >
                Discord ID
              </label>
              <div className="mt-1 text-sm text-gray-500">
                {user.user_metadata.provider_id}
              </div>
            </div>

            {wallet ? (
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wallet Address
                </label>
                <div className="mt-1 text-sm text-gray-500">
                  {wallet.wallet_address}
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="flex justify-end">
              {wallet ? (
                <>
                  <LinkBtn
                    to={process.env.NEXT_PUBLIC_DISCORD_SERVER_URL || "/"}
                    extraClasses="mr-2"
                  >
                    Go to our discord
                  </LinkBtn>
                  <WalletDeleteBtn />
                </>
              ) : (
                <WalletConnectBtn />
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
