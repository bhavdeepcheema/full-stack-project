import { FrontendTerm as Term } from "@shared/types/frontend-term";

type ApiResponse<T> = {
  status: string;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
};

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const TERM_ENDPOINT = "/terms";

export async function fetchTerms(sessionToken?: string | null): Promise<Term[]> {
  const url = `${BASE_URL}${TERM_ENDPOINT}`;
  console.log("Fetching terms from:", url);

  const termResponse: Response = await fetch(
    url,
    sessionToken
      ? {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      : undefined
  );

  console.log("Response status:", termResponse.status);

  if (!termResponse.ok) {
    throw new Error("Failed to fetch terms");
  }

  const json: ApiResponse<Term[]> = await termResponse.json();
  console.log("terms response:", json);

  if (!json.data) {
    return [];
  }

  return json.data;
}

export async function getTermById(
  termId: number,
  sessionToken?: string | null
): Promise<Term> {
  const termResponse: Response = await fetch(
    `${BASE_URL}${TERM_ENDPOINT}/${termId}`,
    sessionToken
      ? {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      : undefined
  );

  if (!termResponse.ok) {
    throw new Error(`Failed to fetch term with id ${termId}`);
  }

  const json: ApiResponse<Term> = await termResponse.json();

  if (!json.data) {
    throw new Error("Term data missing from response");
  }

  return json.data;
}

export async function updateTerm(
  term: Term,
  sessionToken: string
): Promise<Term> {
  const updateResponse: Response = await fetch(
    `${BASE_URL}${TERM_ENDPOINT}/${term.id}`,
    {
      method: "PUT",
      body: JSON.stringify({ ...term }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  if (!updateResponse.ok) {
    throw new Error(`Failed to update term with id ${term.id}`);
  }

  const json: ApiResponse<Term> = await updateResponse.json();

  if (!json.data) {
    throw new Error(`Updated term data missing for id ${term.id}`);
  }

  return json.data;
}

console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
console.log("Fetching URL =", `${BASE_URL}${TERM_ENDPOINT}`);