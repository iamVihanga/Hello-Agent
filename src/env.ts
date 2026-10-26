import dotenv from "dotenv";

let loaded = false;

export function loadEnv() {
  if (!loaded) {
    dotenv.config();
    loaded = true;
  }
}
