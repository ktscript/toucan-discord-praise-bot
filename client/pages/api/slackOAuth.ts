import { supabase } from "../../utils/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";
import { App as Slack } from "@slack/bolt";

interface ifcInstallation {
  enterpriseId?: string;
  teamId: string;
  botToken: string; // starting with xoxb
  botId: string;
  botUserId: string;
}

// handle OAuth for Slack app installation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO this should be the on inserting an ifcInstallation into db
  const code = req.query["code"];

  const slack: Slack = new Slack({
    token: process.env.SLACK_BOT_TOKEN, // TODO this will need to be taken from dB, but how does this know which token to take
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
  });
  const access = await slack.client.oauth.v2.access({
    code: String(code),
    client_id: process.env.SLACK_CLIENT_ID || "",
    client_secret: process.env.SLACK_CLIENT_SECRET || "",
  });

  console.log("access", access);

  const { data, error } = await supabase.from("slack_installations").insert([
    {
      enterprise_id: access.enterprise?.id,
      team_id: access.team?.id,
      bot_token: access.access_token,
      bot_id: access.app_id, // TODO could be wrong. example: B5910
      bot_user_id: access.bot_user_id,
    },
  ]);
  if (error || !req.query["code"]) {
    res.status(500).json({ message: "Some error happened", error: error });
  } else {
    res
      .status(200)
      .json({ status: "OK", message: "The bot has been installed." });
  }
}
