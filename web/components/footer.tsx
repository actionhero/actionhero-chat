import { useApi } from "./../hooks/useApi";

export default function footer({ errorHandler }) {
  const [result, loading] = useApi(errorHandler, "get", "/api/1/status");

  return (
    <footer>
      <hr />
      <small>
        {loading ? "loading..." : `Connected to api v${result.version}`}
      </small>
    </footer>
  );
}
