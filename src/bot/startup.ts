import { Bot, webhookCallback } from "grammy";
import { supalog } from "../api/log.ts";
import { cors } from "../network-utils.ts";
import { getUserAwardsCount } from "../api/awards.ts";

const dev = Deno.env.get("ENV") === "dev";

async function handlePrepareShare(req: Request, bot: Bot) {
  try {
    const body = await req.json();

    console.log("shareMessage: Received the body", body);

    if (!body.message || !body.user_id) {
      console.error("Missing parameters");
      return cors(
        new Response(
          JSON.stringify({
            error: "Missing required parameters: message and user_id",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        ),
        req,
      );
    }

    console.log("shareMessage: Preparing the message");

    // Completem el missatge amb els trofeus
    const userAwards = await getUserAwardsCount(body.user_id)
    const awardsSectionMessage = `🥇${userAwards?.gold_trophies || 0} 🥈${userAwards?.silver_trophies || 0} 🥉${userAwards?.bronze_trophies || 0}`

    const result = await bot.api.savePreparedInlineMessage(
      body.user_id,
      {
        type: "article",
        id: Date.now().toString(),
        title: `Mooot`,
        input_message_content: {
          message_text: `${awardsSectionMessage}\n\n${body.message}`,
          parse_mode: "HTML",
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Jugar",
                url: "https://t.me/mooot_cat_bot/mooot",
              },
            ],
          ],
        },
      },
      {
        allow_user_chats: true,
        allow_bot_chats: true,
        allow_group_chats: true,
        allow_channel_chats: false,
      },
    );

    console.log("shareMessage: Message ready", result);

    return cors(
      new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
      req,
    );
  } catch (error: any) {
    supalog.error("Error in handlePrepareShare", undefined, undefined, error);
    return cors(
      new Response(
        JSON.stringify({ error: "Failed to prepare inline message" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      ),
      req,
    );
  }
}

export function startUp(token: string) {
  const bot = new Bot(token);

  if (dev) {
    console.log("Starting bot in development mode (polling)");
    bot.start();
    console.warn(
      'Remember to set the webhook again after your local development with "deno task set-webhook" or rebuilding in production',
    );
  } else {
    console.log("Starting bot in production mode (webhook)");

    const handleUpdate = webhookCallback(bot, "std/http");

    Deno.serve(async (req) => {
      try {
        const url = new URL(req.url);

        if (url.pathname === "/prepare-share") {
          if (req.method === "OPTIONS") {
            return cors(new Response(null, { status: 204 }), req);
          }
          if (req.method === "POST") {
            return await handlePrepareShare(req, bot);
          }
        }

        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return await handleUpdate(req);
        }

        return new Response(
          "Afegeix mooot_cat_bot a un grup de Telegram i competeix contra els teus amics",
          { status: 200 },
        );
      } catch (err) {
        console.error("Error handling request:", err);
        return new Response("Error handling request", { status: 500 });
      }
    });
  }

  return bot;
}
