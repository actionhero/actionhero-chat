import Router from "next/router";
import { useEffect } from "react";
import { useApi } from "./../hooks/useApi";

export default function SignOut({ successHandler, errorHandler }) {
  const [loading, execApi, response] = useApi(
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
      // Router.push("/");
      window.location.href = "/"; // this will force the whole page to re-render
    }
  });

  return (
    <>
      <small>Signing Out...</small>
    </>
  );
}
