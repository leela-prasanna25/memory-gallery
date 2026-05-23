/** User-facing message for axios/fetch failures (network vs HTTP body). */
export function getApiErrorMessage(err, fallback) {
  const body = err.response?.data?.message;
  if (body) return body;

  if (!err.response) {
    const code = err.code;
    const msg = (err.message || "").toLowerCase();
    if (
      code === "ERR_NETWORK" ||
      code === "ECONNABORTED" ||
      code === "ERR_CONNECTION_REFUSED" ||
      err.message === "Network Error" ||
      msg.includes("network") ||
      msg.includes("connection refused")
    ) {
      return "Cannot connect to the server. Open a terminal, run `cd Backend` then `npm run dev`, and keep it running (API on port 5000).";
    }
  }

  return err.message || fallback;
}
