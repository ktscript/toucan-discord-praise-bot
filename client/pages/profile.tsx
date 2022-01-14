import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { WalletConnectBtn } from "../components/Buttons";

interface IfcProfilePageProps {
  authenticatedState: boolean;
}

// TODO make a page to save wallet in Supabase
const Profile: NextPage<IfcProfilePageProps> = ({
  authenticatedState,
}: IfcProfilePageProps) => {
  /**
   * if the user is not logged in I want to redirect him to the home page
   */
  const router = useRouter();
  useEffect(() => {
    if (!authenticatedState) {
      router.push("/");
    }
  });

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
      <p>All you need to do now is connect your wallet</p>
      <WalletConnectBtn />
    </div>
  );
};

export default Profile;
