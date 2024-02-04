import { Telegraf, Types } from "telegraf";

import { config } from "../common/dotenv";
import { textEventHandlerFabric } from "./eventHandlers/textEvent";
import { RequestSender } from "./requestSender";
import { deleteEventHadlerFabric } from "./eventHandlers/deleteEvent";
import { error } from "../common/error";
import { log } from "../common/logger";
config();

export const bootstrap = async () => {
  let res = { ok: true };

  const bot = (() => {
    try {
      return new Telegraf(process.env.BOT_SECRET!);
    } catch (e) {
      error({ name: "Bot initialization error" });
    }
  })();
  if (!bot) {
    return;
  }
  log("Bot started");

  const requestSender = new RequestSender();
  log("RequestSender created");

  res = await requestSender.auth();
  log("RequestSender authed");

  if (!res.ok) {
    try {
      bot.stop();
    } catch (e) { }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    error({ name: "Initialization error", message: "Reloading..." }, true);
    return;
  }

  bot.command("delete", deleteEventHadlerFabric(requestSender));

  bot.on("text", textEventHandlerFabric(requestSender));

  await bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
