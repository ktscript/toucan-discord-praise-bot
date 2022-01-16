import Link from "next/link";
import router from "next/router";
import connectWallet from "../utils/connectWallet";
import deleteWallet from "../utils/deleteWallet";
import fetchWallet from "../utils/fetchWallet";
import signIn from "../utils/signIn";
import { supabase } from "../utils/supabaseClient";

interface ifcLinkBtnProps {
  extraClasses?: string;
  to: string;
}

interface ifcBtnProps {
  extraClasses?: string;
}

export const LinkBtn = ({ extraClasses, to }: ifcLinkBtnProps) => {
  return (
    <Link href={to}>
      <a
        className={`${extraClasses} inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:opacity-70`}
      >
        Sign out
      </a>
    </Link>
  );
};

export const DiscordAuthBtn = ({ extraClasses }: ifcBtnProps) => {
  return (
    <button
      onClick={() => {
        signIn();
      }}
      className={`${extraClasses} inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:opacity-70`}
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
    </button>
  );
};

export const SignOutBtn = ({ extraClasses }: ifcBtnProps) => {
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }
  return (
    <button
      onClick={() => {
        signOut();
      }}
      className={`${extraClasses} inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:opacity-70`}
    >
      Sign out
    </button>
  );
};

export const WalletConnectBtn = ({ extraClasses }: ifcBtnProps) => {
  return (
    <button
      onClick={async () => {
        await connectWallet();
      }}
      className={`${extraClasses} inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:opacity-70`}
    >
      Connect Wallet
    </button>
  );
};

export const WalletDeleteBtn = ({ extraClasses }: ifcBtnProps) => {
  return (
    <button
      onClick={async () => {
        await deleteWallet();
      }}
      className={`${extraClasses} inline-flex justify-center py-2 px-4 rounded-md shadow-sm bg-red-600 text-sm font-medium text-white hover:opacity-70`}
    >
      Delete Wallet
    </button>
  );
};
