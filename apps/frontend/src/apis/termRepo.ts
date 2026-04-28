import { FrontendTerm as Term } from "@shared/types/frontend-term";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const TERM_ENDPOINT = "/terms";

// Helper to map backend raw object to our FrontendTerm type
const mapToFrontendTerm = (raw: any): Term => ({
  id: raw.id,
  title: raw.title, // 'title' matches your FrontendTerm type
  definition: raw.definition,
  createdAt: raw.createdAt,
  favouritesCount: raw.favouritesCount ?? 0,
  isFavourite: raw.isFavourite ?? false,
});

export async function fetchTerms(sessionToken?: string | null): Promise<Term[]> {
  const url = `${BASE_URL}${TERM_ENDPOINT}`;

  const termResponse: Response = await fetch(url, {
    headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
  });

  if (!termResponse.ok) {
    throw new Error("Failed to fetch terms");
  }

  // The backend now returns { status: "success", data: [...] }
  const json = await termResponse.json();
  
  // Unwrap the 'data' property and map the array
  return (json.data as any[]).map(mapToFrontendTerm);
}

export async function getTermById(
  termId: number,
  sessionToken?: string | null
): Promise<Term> {
  const termResponse: Response = await fetch(`${BASE_URL}${TERM_ENDPOINT}/${termId}`, {
    headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
  });

  if (!termResponse.ok) {
    throw new Error(`Failed to fetch term with id ${termId}`);
  }

  const json = await termResponse.json();
  // Unwrap the 'data' property for single objects
  return mapToFrontendTerm(json.data);
}

export async function updateTerm(
  term: Term,
  sessionToken: string
): Promise<Term> {
  // Mapping 'title' (frontend) back to 'title' (backend) 
  // *Ensure your backend controller expects 'title' now*
  const payload = {
    id: term.id,
    title: term.title,
    definition: term.definition,
  };

  const updateResponse: Response = await fetch(`${BASE_URL}${TERM_ENDPOINT}/${term.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!updateResponse.ok) {
    throw new Error(`Failed to update term with id ${term.id}`);
  }

  const json = await updateResponse.json();
  return mapToFrontendTerm(json.data);
}