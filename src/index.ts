import { bootstrap } from "./bot";
import { error } from "./common/error";

try {
  bootstrap();
} catch (e) {
  error(e as Error, true);
}
