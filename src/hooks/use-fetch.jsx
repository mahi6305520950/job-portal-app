import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { session } = useSession();

  const fn = async (...args) => {
    if (!session) {
      console.log("No session yet");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase"
      });

      console.log("Got token");

      const res = await cb(supabaseAccessToken, options, ...args);
      console.log("API result:", res);

      setData(res);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { fn, data, error, loading };
};

export default useFetch;
