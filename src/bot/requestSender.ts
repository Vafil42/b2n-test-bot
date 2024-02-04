import { config } from "dotenv";
import { error } from "../common/error";
config();

interface BodyInterface {
  messages: {
    role: string;
    content: string;
  }[];
}

interface AuthBodyInteface {
  token: string;
}

export class RequestSender {
  apiUrl = process.env.API_URL!;
  apiToken?: string;

  constructor() {
    if (!this.apiUrl) {
      throw new Error("Api Url is udefined");
    }
  }

  async send(message: string, userId: string) {
    const res = await this.req<BodyInterface>(
      this.apiUrl + `dialogs/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiToken!,
        },
        body: JSON.stringify({ message }),
      },
    );

    if (!res.ok || !res.data.messages) {
      return { ok: false } as const;
    }

    const answer = res.data.messages[res.data.messages.length - 1].content;

    return { ok: true, answer } as const;
  }

  async auth() {
    const res = await this.req<AuthBodyInteface>(this.apiUrl + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: process.env.API_LOGIN,
        password: process.env.API_PASSWORD,
      }),
    });

    if (!res.ok || !res.data.token) {
      return { ok: false } as const;
    }

    this.apiToken = res.data.token;
    return { ok: true } as const;
  }

  async deleteDialog(userId: string) {
    await this.req(this.apiUrl + `dialogs/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.apiToken!,
      },
    });
  }

  private async req<DataType>(url: string, req: RequestInit) {
    const res = await fetch(url, req).catch((e) =>
      error({ name: "Error while fetch", message: e }),
    );
    if (!res) {
      return { ok: false } as const;
    }

    const data = await res
      .json()
      .catch((e) =>
        error({ name: "Error while parsing fetch data", message: e }),
      );

    return { ok: true, data: data as DataType } as const;
  }
}
