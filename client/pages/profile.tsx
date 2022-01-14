import { NextPage } from "next";
import { Head } from "next/document";
import React from "react";

// TODO make a page to save wallet in Supabase
const Profile: NextPage = () => {
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
    </div>
  );
};

export default Profile;
