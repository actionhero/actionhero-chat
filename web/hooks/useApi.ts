import { useState } from "react";
import { Client } from "../client/client";
import { ErrorHandler } from "./../utils/errorHandler";

const client = new Client();

export function useApi(errorHandler: ErrorHandler) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function execApi(
    data = {},
    path: string,
    verb = "get",
    setter?: Function,
    setterKey?: string
  ) {
    if (data === null || data === undefined) {
      data = {};
    }

    setLoading(true);

    let apiResponse: { [key: string]: any };
    try {
      apiResponse = await client.action(verb, path, data);
      setResponse(apiResponse);

      if (setter) {
        if (setterKey) {
          setter(apiResponse[setterKey]);
        } else {
          setter(apiResponse);
        }
      }
    } catch (error) {
      if (errorHandler) {
        errorHandler.set({ error: error });
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
      return apiResponse;
    }
  }

  return { loading, execApi, response };
}
