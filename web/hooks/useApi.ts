import { useState, useEffect } from "react";
import { Client } from "../client/client";
import { ErrorHandler } from "./../utils/errorHandler";

export function useApi(
  errorHandler: ErrorHandler,
  verb = "get",
  path,
  data = {}
) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = new Client();

  useEffect(() => {
    async function makeApiRequest() {
      try {
        setLoading(true);
        const response = await client.action(verb, path, data);
        setResult(response);
        setLoading(false);
      } catch (error) {
        if (errorHandler) {
          errorHandler.set({ error: error });
        }
      } finally {
        // setLoading(false);
      }
    }

    makeApiRequest();
  }, [verb, path]);

  return [result, loading];
}
