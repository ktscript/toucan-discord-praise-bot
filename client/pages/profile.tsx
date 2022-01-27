import { User } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LinkBtn } from "../components/Buttons";
import { Loader, NotLoggedInModal } from "../components/Modals";
import fetchProfile from "../utils/fetchProfile";
import fetchWallet from "../utils/fetchWallet";
import getMetaMaskAccount from "../utils/getMetaMaskAccount";
import ifcWalletConnection from "../utils/ifcWalletConnection";
import { supabase } from "../utils/supabaseClient";
import toastOptions from "../utils/toastOptions";

interface ifcProviders {
  slackId?: string;
  discordId?: string;
}

const Profile: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<ifcWalletConnection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState<ifcProviders>({});

  const deleteWallet = async () => {
    console.log("attempting to delete wallet");
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from<ifcWalletConnection>("wallet_connections")
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

      /**
       * we attempt to get the metamask accounts from the browser
       */
      const accounts = await getMetaMaskAccount();

      /**
       * and we attempt to save the wallet connection to the database
       */
      const { data, error } = await supabase
        .from<ifcWalletConnection>("wallet_connections")
        .insert([
          {
            user_id: user?.id,
            discord_id: providers.discordId,
            slack_id: providers.slackId,
            wallet_address: accounts[0],
          },
        ]);
      if (error) throw error;

      // we refetch the wallet and set it into React State
      setWallet(await fetchWallet(user?.id || ""));
      toast(`Connected your wallet`, toastOptions);
    } catch (error: any) {
      console.error("error when connecting wallet", error);
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  /**
   * this piece of codes runs whenever anything on the page changes
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setUser(await supabase.auth.user());
      setLoading(false);
    })();
  }, []);

  /**
   * this piece of codes runs whenever 'user' React State changes
   */
  useEffect(() => {
    (async () => {
      /**
       * this attempts to fetch the wallet connection and set it in React State
       */
      if (user?.id) {
        setWallet(await fetchWallet(user?.id));
      }
      /**
       * we are trying to extract the slack/discord identities in a easy to access React State
       */
      if (user?.identities) {
        const tempProviders: ifcProviders = {};
        user.identities.map((identity) => {
          if (identity.provider === "slack") {
            tempProviders.slackId = identity.identity_data.provider_id;
          } else if (identity.provider === "discord") {
            tempProviders.discordId = identity.identity_data.provider_id;
          }
        });
        setProviders(tempProviders);
      }
    })();
  }, [user]);

  /**
   * this piece of codes runs whenever 'providers' React State changes
   */
  useEffect(() => {
    (async () => {
      /**
       * if there is a wallet address in React state we update the wallet connection.
       * this is done such that we update the wallet connection to contain both discord & slack (if that's the case)
       * TODO: this is not the most efficient solution, but it gets the job done for now
       */
      if (wallet?.wallet_address) {
        const { data, error } = await supabase
          .from<ifcWalletConnection>("wallet_connections")
          .update({
            user_id: user?.id,
            discord_id: providers.discordId,
            slack_id: providers.slackId,
            wallet_address: wallet.wallet_address,
          })
          .match({ user_id: user?.id });
        if (error) {
          console.error("error when updating walletConnection", error);
          toast.error(error.message, toastOptions);
        }
      }
    })();
  }, [providers]);

  if (loading) {
    console.log("loading...");
    return <Loader />;
  }

  if (!user) {
    return <NotLoggedInModal />;
  }

  console.log("state of user:", user);
  console.log("state of wallet:", wallet);
  console.log("state of providers:", providers);

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
                Photo
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

            {providers.discordId ? (
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discord ID
                </label>
                <div className="mt-1 text-sm text-gray-500">
                  {providers.discordId}
                </div>
              </div>
            ) : (
              ""
            )}

            {providers.slackId ? (
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Slack ID
                </label>
                <div className="mt-1 text-sm text-gray-500">
                  {providers.slackId}
                </div>
              </div>
            ) : (
              ""
            )}

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
