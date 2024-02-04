import { Context } from "telegraf";
import { RequestSender } from "../requestSender";
import { Update } from "telegraf/typings/core/types/typegram";
import { error } from "../../common/error";

export const deleteEventHadlerFabric = (requestSender: RequestSender) => {
  return async (ctx: Context<Update>) => {
    try {
      await requestSender.deleteDialog(ctx.message!.from.id.toString());

      ctx.sendSticker(
        "CAACAgIAAxkBAAN_ZbwM4sdcfB7C4oRa6OM93EFA1xkAAscSAAKXCPlIVF55KuWcpAU0BA",
      );
    } catch (e) {
      error(e as Error);
    }
  };
};
