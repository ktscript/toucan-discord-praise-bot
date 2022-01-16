import type { NextPage } from "next";
import Head from "next/head";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { DiscordAuthBtn } from "../components/Buttons";
import { useEffect } from "react";
import Loader from "../components/Loader";

interface IfcHomePageProps {
  authenticatedState: boolean;
}
// TODO: somehow the auth is broken on the live site, not on my local machine

const Home: NextPage<IfcHomePageProps> = ({
  authenticatedState,
}: IfcHomePageProps) => {
  console.log("home page initialized");
  /**
   * if the user is logged in already I want to redirect him to his profile page
   */
  const router = useRouter();

  if (authenticatedState) {
    console.log("authenticate state true, about to push /profile");
    // TODO: this is why my auth is broken, because the router.push, for some reason does not work
    router.push("/profile");
    return <Loader />;
  }

  return (
    <div>
      <Head>
        <title>Toucan Praise Bot</title>
        <meta
          name="description"
          content="A page to authenticate with your discord account."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative bg-gray-100 overflow-hidden">
        <div
          className="hidden sm:block sm:absolute sm:inset-0"
          aria-hidden="true"
        ></div>
        <div className="relative pt-6 pb-16 sm:pb-24">
          <main className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-7xl">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                  <div>
                    <Link href="https://toucan-protocol.notion.site/Onboarding-ea467f8f713e43ad8bb396e69ad2ecf7">
                      <a className="inline-flex items-center text-black bg-gray-200 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:opacity-70">
                        <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-green-600 rounded-full">
                          We&lsquo;re hiring
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
                          Authenticate with Discord &amp; then connect your
                          wallet
                        </p>
                        <div className="mt-4">
                          <DiscordAuthBtn extraClasses="w-full" />
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
