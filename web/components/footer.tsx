import { useState, useEffect } from "react";
import { useApi } from "./../hooks/useApi";

export default function footer({ errorHandler }) {
  const [version, setVersion] = useState("~");
  const { loading, execApi } = useApi(errorHandler);

  useEffect(() => {
    execApi(null, "/api/1/status", "get", (response) => {
      setVersion(response.version);
    });
  }, []);

  return (
    <footer>
      <hr />
      <small>
        <a href="https://github.com/actionhero/actionhero-chat" target="_new">
          View project source on Github
        </a>
        <br />
        {loading ? "loading..." : `Connected to api v${version}`}
      </small>
    </footer>
  );
}
