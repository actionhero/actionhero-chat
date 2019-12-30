import Router from "next/router";
import { useEffect } from "react";
import { useApi } from "./../hooks/useApi";

export default function SignOut({
  successHandler,
  errorHandler,
  sessionHandler
}) {
  const { execApi, response } = useApi(
    errorHandler,
    "/api/1/session",
    "delete"
  );

  useEffect(() => {
    execApi();
  }, []);

  useEffect(() => {
    if (response) {
      window.localStorage.clear();
      successHandler.set({ message: "Signed out" });
      sessionHandler.set();
      Router.push("/");
    }
  });

  return (
    <>
      <small>Signing Out...</small>
    </>
  );
}
