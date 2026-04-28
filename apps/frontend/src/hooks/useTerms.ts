import { useEffect, useState } from "react";
import { FrontendTerm as Term } from "@shared/types/frontend-term";
import * as TermService from "../services/termService";
import { useAuth } from "@clerk/clerk-react";

export function useTerms(
  dependencies: unknown[] = [],
  filterFn?: ((term: Term) => boolean) | null,
) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [terms, updateTerms] = useState<Term[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTerms = async () => {
    try {
      setError(null);

      const sessionToken = isSignedIn ? await getToken() : null;
      let result = await TermService.fetchTerms(sessionToken);
      console.log("useTerms result:", result);
console.log("useTerms result length:", result.length);
console.log("sessionToken exists?", !!sessionToken);

      console.log("Fetched terms:", result);
      console.log("Fetched terms count:", result.length);

      if (filterFn) {
        result = result.filter(filterFn);
        console.log("Filtered terms:", result);
        console.log("Filtered terms count:", result.length);
      }

      updateTerms(result);
    } catch (errorObject) {
      setError(errorObject instanceof Error ? errorObject.message : String(errorObject));
    }
  };

  const toggleFavouriteTerm = async (termId: number) => {
    try {
      const sessionToken = isSignedIn ? await getToken() : null;

      if (!sessionToken) {
        throw new Error("Not Authorized");
      }

      await TermService.toggleFavouriteTerm(termId, sessionToken);
      await fetchTerms();
    } catch (errorObject) {
      setError(errorObject instanceof Error ? errorObject.message : String(errorObject));
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    fetchTerms();
  }, [isLoaded, isSignedIn, filterFn, ...dependencies]);

  return { terms, error, updateTerms, fetchTerms, toggleFavouriteTerm };
}