import { bootstrap } from "../bot";
import { errorLog } from "./logger";

export interface ErrorInterface {
  name: string;
  message?: any;
}

export const error = (error: ErrorInterface, reload?: true) => {
  errorLog(`--${error.name}-- \n ${error.message}`);
  if (reload) bootstrap();
};
