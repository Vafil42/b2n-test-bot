import { Context, NarrowedContext, Telegraf } from "telegraf";
import { RequestSender } from "../requestSender";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { error } from "../../common/error";
import { log } from "../../common/logger";

const USER_ERROR_MESSAGE = "Что-то пошло не так. Попробуйте еще раз.";

export const textEventHandlerFabric = (requestSender: RequestSender) => {
  return async (ctx: Context<Update> & { message: Message.TextMessage }) => {
    try {
      ctx.sendChatAction("typing");

      const { ok, answer } = await requestSender.send(
        ctx.message.text,
        ctx.message.from.id.toString(),
      );

      if (!ok) {
        ctx.sendMessage(USER_ERROR_MESSAGE);
        return;
      }

      ctx.sendMessage(answer);
      log("Message handled");
    } catch (e) {
      error(e as Error);
    }
  };
};
