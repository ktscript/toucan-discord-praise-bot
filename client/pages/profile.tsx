import { ApiError, User } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { NextApiRequest, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LinkBtn } from "../components/Buttons";
import { Loader, NotLoggedInModal } from "../components/Modals";
import fetchProfile from "../utils/fetchProfile";
import fetchWallet from "../utils/fetchWallet";
import getUserByCookie from "../utils/getUserByCookie";
import discordToWalletConnection from "../utils/ifcDiscordtoWalletConnection";
import { supabase } from "../utils/supabaseClient";
import toastOptions from "../utils/toastOptions";

const Profile: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<discordToWalletConnection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteWallet = async () => {
    console.log("attempting to delete wallet");
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from<discordToWalletConnection>("discordToWalletConnections")
        .delete();
      if (error) throw error;
      toast("Wallet deleted successfully", toastOptions);
      if (data) setWallet(null);
      console.log("state of wallet:", wallet);
    } catch (error: any) {
      console.error("error deleting wallet", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // TODO add more ways to connect your wallet
  const connectWallet = async () => {
    console.log("attempting to connect to the MetaMask wallet");
    try {
      setLoading(true);
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error("MetaMask not connected");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      // TODO add more networks
      if (chainId != 4) {
        throw new Error("Make sure you are on Rinkeby Test Network.");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const user = await fetchProfile();

      const { data, error } = await supabase
        .from<discordToWalletConnection>("discordToWalletConnections")
        .insert([
          {
            // @ts-ignore because if it's null it will simply return an error which is handled down below
            user_id: user.id,
            // @ts-ignore because if it's null it will simply return an error which is handled down below
            discord_id: user.user_metadata.provider_id,
            wallet_address: accounts[0],
          },
        ]);
      if (error) throw error;
      setWallet(await fetchWallet(user?.id || ""));
      toast(`Connected your wallet`, toastOptions);
    } catch (error: any) {
      console.error("error when connecting wallet", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setUser(await supabase.auth.user());
      setWallet(await fetchWallet(user?.id || ""));
      setLoading(false);
    })();
    console.log("state of wallet:", wallet);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
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
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      await deleteWallet();
                    }}
                    className={`inline-flex justify-center py-2 px-4 rounded-md shadow-sm bg-red-600 text-sm font-medium text-white hover:opacity-70`}
                  >
                    Delete Wallet
                  </button>
                </>
              ) : (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    await connectWallet();
                  }}
                  className={`inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:opacity-70`}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
