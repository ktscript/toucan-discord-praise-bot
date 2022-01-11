import type { NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

const navigation = [
  { name: "Products", href: "https://toucan.earth/#products" },
  { name: "Docs", href: "https://docs.toucan.earth/" },
  { name: "Toucan App", href: "https://toucan.earth/bridge" },
  { name: "Discord", href: "https://discord.gg/cDbWuZKWxe" },
];

const Home: NextPage = () => {
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
                      <span className="md:block">Auth to our praise bot,</span>{" "}
                      <span className="text-green-500 md:block">
                        earn on-chain reputation.
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      We are using this bot with the associated token to create
                      a reputation system for our community. Use the form to
                      connect your wallet to your discord or scroll down to
                      learn more.
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
                          Sign in with Discord &amp; then connect your wallet
                        </p>

                        <div className="mt-4">
                          <div>
                            {/* TODO make a Discord-based auth */}
                            <a
                              href="#discord"
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:opacity-70"
                            >
                              <span className="mr-1">Sign in with Discord</span>
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                fill="currentColor"
                              >
                                <path d="M9.593 10.971c-.542 0-.969.475-.969 1.055 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055.011-.581-.427-1.055-.968-1.055zm3.468 0c-.542 0-.969.475-.969 1.055 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055-.001-.581-.427-1.055-.968-1.055z"></path>
                                <path d="M17.678 3H4.947A1.952 1.952 0 0 0 3 4.957v12.844c0 1.083.874 1.957 1.947 1.957H15.72l-.505-1.759 1.217 1.131 1.149 1.064L19.625 22V4.957A1.952 1.952 0 0 0 17.678 3zM14.01 15.407s-.342-.408-.626-.771c1.244-.352 1.719-1.13 1.719-1.13-.39.256-.76.438-1.093.562a6.679 6.679 0 0 1-3.838.398 7.944 7.944 0 0 1-1.396-.41 5.402 5.402 0 0 1-.693-.321c-.029-.021-.057-.029-.085-.048a.117.117 0 0 1-.039-.03c-.171-.094-.266-.16-.266-.16s.456.76 1.663 1.121c-.285.36-.637.789-.637.789-2.099-.067-2.896-1.444-2.896-1.444 0-3.059 1.368-5.538 1.368-5.538 1.368-1.027 2.669-.998 2.669-.998l.095.114c-1.71.495-2.499 1.245-2.499 1.245s.21-.114.561-.275c1.016-.446 1.823-.57 2.156-.599.057-.009.105-.019.162-.019a7.756 7.756 0 0 1 4.778.893s-.751-.712-2.366-1.206l.133-.152s1.302-.029 2.669.998c0 0 1.368 2.479 1.368 5.538 0-.001-.807 1.376-2.907 1.443z"></path>
                              </svg>
                            </a>
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
