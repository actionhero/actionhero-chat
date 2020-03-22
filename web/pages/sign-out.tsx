import Router from "next/router";
import { useEffect } from "react";
import { useApi } from "./../hooks/useApi";

export default function SignOut({
  successHandler,
  errorHandler,
  sessionHandler,
}) {
  const { loading, execApi } = useApi(errorHandler);

  useEffect(() => {
    execApi(null, "/api/1/session", "delete", () => {
      window.localStorage.clear();
      successHandler.set({ message: "Signed out" });
      sessionHandler.set();
      Router.push("/");
    });
  }, []);

  return <>{loading ? <small>Signing Out...</small> : null}</>;
}
