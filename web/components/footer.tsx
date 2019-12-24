import { useApi } from "./../hooks/useApi";

export default function footer({ errorHandler }) {
  const [result, loading] = useApi(errorHandler, "get", "/api/1/status");

  return (
    <footer>
      <hr />
      <small>
        <a href="https://github.com/actionhero/actionhero-chat" target="_new">
          View project source on Github
        </a>
        <br />
        {loading ? "loading..." : `Connected to api v${result.version}`}
      </small>
    </footer>
  );
}
