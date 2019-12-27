import { useState } from "react";
import { Client } from "../client/client";
import { ErrorHandler } from "./../utils/errorHandler";

const client = new Client();

export function useApi(errorHandler: ErrorHandler, path: string, verb = "get") {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function execApi(data = {}, setter?: Function, setterKey?: string) {
    let success = false;

    if (data === null || data === undefined) {
      data = {};
    }

    setLoading(true);

    try {
      const response = await client.action(verb, path, data);
      setResult(response);

      if (setter) {
        if (setterKey) {
          setter(response[setterKey]);
        } else {
          setter(response);
        }
      }

      success = true;
    } catch (error) {
      success = false;
      if (errorHandler) {
        errorHandler.set({ error: error });
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
      return success;
    }
  }

  return [loading, execApi, result];
}
