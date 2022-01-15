import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { WalletConnectBtn, WalletDeleteBtn } from "../components/Buttons";
import fetchWallet from "../utils/fetchWallet";
import discordToWalletConnection from "../utils/ifcDiscordtoWalletConnection";

interface IfcProfilePageProps {
  authenticatedState: boolean;
}

// TODO make a page to save wallet in Supabase
const Profile: NextPage<IfcProfilePageProps> = ({
  authenticatedState,
}: IfcProfilePageProps) => {
  const router = useRouter();
  const [wallet, setWallet] = useState<discordToWalletConnection | null>(null);

  useEffect(() => {
    // if the user is not logged in I want to redirect him to the home page
    if (!authenticatedState) {
      router.push("/");
    }

    (async () => {
      setWallet(await fetchWallet());
    })();

    // TODO stop potential memory leaks
    const controller = new AbortController();
    return () => controller.abort();
  }, []);

  // TODO I need to make sure that after I connect or delete the wallet, the page gets re-rendered

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
      {wallet ? (
        <>
          <p>You are connected with this wallet: {wallet.wallet_address}</p>
          <WalletDeleteBtn />
        </>
      ) : (
        <>
          <p>All you need to do now is connect your wallet</p>
          <WalletConnectBtn />
        </>
      )}
    </div>
  );
};

export default Profile;
