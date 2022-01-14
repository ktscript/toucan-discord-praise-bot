import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import handleAuthChange from "../utils/handleAuthChange";
import fetchProfile from "../utils/fetchProfile";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [authenticatedState, setAuthenticatedState] = useState<boolean>(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
        if (event === "SIGNED_IN") {
          setAuthenticatedState(true);
          router.push("/profile");
        }
        if (event === "SIGNED_OUT") {
          setAuthenticatedState(false);
          router.push("/");
        }
      }
    );
    checkUser();
    return () => {
      // TODO: check this out
      // @ts-ignore
      authListener.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const profile = await fetchProfile();
    if (profile) {
      setAuthenticatedState(true);
    }
  }

  return (
    <div>
      <Navbar authenticatedState={authenticatedState} />
      <Component authenticatedState={authenticatedState} {...pageProps} />
      <ToastContainer />
    </div>
  );
};

export default MyApp;
