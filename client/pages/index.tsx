import type { NextPage } from "next";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import { AuthBtn } from "../components/Buttons";
import { ethers } from "ethers";
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastOptions from "../utils/toastOptions";
import { useRouter } from "next/router";

const navigation = [
  { name: "Products", href: "https://toucan.earth/#products" },
  { name: "Docs", href: "https://docs.toucan.earth/" },
  { name: "Toucan App", href: "https://toucan.earth/bridge" },
  { name: "Discord", href: "https://discord.gg/cDbWuZKWxe" },
];

interface discordToWalletConnection {
  user_id: string;
  discord_id: string;
  wallet_address: string;
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(supabase.auth.user());
  const [wallet, setWallet] = useState<string>("");

  /**
   * TODO why on God's green earth does the fucking redirect from Discord come back to my app without the session already set?
   * why the fuck does the user HAVE to refresh the page to have the session cookie set?
   * I HATE FUCKING SESSION COOKIES AND AUTH SYSTEMS
   */

  /**
   * I didn't want to use these hooks, but I need to because of a hydration error which is explained here:
   * https://nextjs.org/docs/messages/react-hydration-error
   */
  const [discordAuthStatus, setDiscordAuthStatus] = useState<boolean>(false);
  useEffect(() => {
    if (user?.aud) {
      setDiscordAuthStatus(true);
    }
  }, []);

  async function signout() {
    const { error } = await supabase.auth.signOut();
  }

  const handleDiscordAuth = async () => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        provider: "discord",
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.error_description || error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Attempts to connect to the MetaMask wallet and set the account in React State, calling getVoter() and getAllProposals() at the end.
   * @returns true or false depending on success or failure.
   */
  const handleWalletAuth = async () => {
    try {
      setLoading(true);
      if (!user?.aud) {
        throw new Error("You are not authenticated");
      }

      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error("MetaMask not connected");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId != 4) {
        throw new Error("Make sure you are on Rinkeby Test Network.");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(accounts[0]);

      const { data, error } = await supabase
        .from<discordToWalletConnection>("discordToWalletConnections")
        .insert([
          {
            user_id: user.id,
            discord_id: user.user_metadata.provider_id,
            wallet_address: accounts[0],
          },
        ]);
      if (error) throw error;

      toast(`Connected your wallet`, toastOptions);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Toucan Praise Bot</title>
        <meta
          name="description"
          content="A page to authenticate &amp; link your discord account to your wallet address."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative bg-gray-100 overflow-hidden">
        <div
          className="hidden sm:block sm:absolute sm:inset-0"
          aria-hidden="true"
        ></div>
        <div className="relative pt-6 pb-16 sm:pb-24">
          <Popover>
            <nav
              className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="flex items-center flex-1">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link href="https://toucan.earth/">
                    <a className="font-medium text-black hover:opacity-70">
                      <span className="sr-only">Toucan</span>
                      <img
                        className="h-8 w-auto"
                        src="/toucan-logo.svg"
                        alt=""
                      />
                    </a>
                  </Link>
                  <div className="-mr-2 flex items-center md:hidden">
                    <Popover.Button className="bg-gray-200 rounded-md p-2 inline-flex items-center justify-center text-gray-500 hover:opacity-70 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="hidden space-x-10 md:flex md:ml-10">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="font-medium text-black hover:opacity-70"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex">
                <AuthBtn
                  discordAuthStatus={discordAuthStatus}
                  loading={loading}
                  handleWalletAuth={handleWalletAuth}
                  handleDiscordAuth={handleDiscordAuth}
                />
              </div>
            </nav>

            <Transition
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
              >
                <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="px-5 pt-4 flex items-center justify-between">
                    <div>
                      <span className="sr-only">Toucan</span>
                      <img
                        className="h-8 w-auto"
                        src="/toucan-logo.svg"
                        alt=""
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <AuthBtn
                    discordAuthStatus={discordAuthStatus}
                    loading={loading}
                    handleWalletAuth={handleWalletAuth}
                    handleDiscordAuth={handleDiscordAuth}
                  />
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <main className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-7xl">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                  <div>
                    <Link href="https://toucan-protocol.notion.site/Onboarding-ea467f8f713e43ad8bb396e69ad2ecf7">
                      <a className="inline-flex items-center text-black bg-gray-200 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:opacity-70">
                        <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-green-600 rounded-full">
                          We're hiring
                        </span>
                        <span className="ml-4 text-sm">
                          Visit our contributor onboarding page
                        </span>
                        <ChevronRightIcon
                          className="ml-2 w-5 h-5 text-gray-500"
                          aria-hidden="true"
                        />
                      </a>
                    </Link>
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-black sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                      <span className="md:block">Auth to our bot,</span>{" "}
                      <span className="text-green-500 md:block">
                        earn on-chain reputation.
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      We are using this bot with the associated token to create
                      a reputation system for our community. Use the button on
                      the right to connect your wallet to your discord.
                    </p>
                    <p className="mt-8 text-sm text-black uppercase tracking-wide font-semibold sm:mt-10">
                      Used by
                    </p>
                    <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex justify-center px-1">
                          <img
                            className="h-9 sm:h-10"
                            src="/toucan-logo.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                  <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                    <div className="px-4 py-8 sm:px-10">
                      <div>
                        <p className="text-sm text-center font-medium text-gray-700">
                          {discordAuthStatus
                            ? "Connect your wallet to your Discord"
                            : "Authenticate with Discord & then connect your wallet"}
                        </p>

                        <div className="mt-4">
                          <div>
                            <AuthBtn
                              discordAuthStatus={discordAuthStatus}
                              loading={loading}
                              handleWalletAuth={handleWalletAuth}
                              handleDiscordAuth={handleDiscordAuth}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-6 bg-gray-50 border-t-2 border-gray-200 sm:px-10">
                      <p className="text-xs leading-5 text-gray-500">
                        By signing up, you agree to our{" "}
                        <a
                          href="#"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Terms
                        </a>
                        ,{" "}
                        <a
                          href="#"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Data Policy
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Cookies Policy
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
