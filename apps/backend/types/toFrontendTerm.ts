import { FrontendTerm } from "@shared/types/frontend-term";
import { TermWithUsers } from "./termWithUsers";

/**
 * This method serves to abstract the many-to-many relationship between
 * Terms and Users so that the frontend only receives relevant data.
 */
export function toFrontendTerm(
  backendTerm: TermWithUsers,
  userId?: string | null
): FrontendTerm {
  const { id, title, definition, createdAt } = backendTerm;

  return {
    id,
    title,
    definition,
    favouritesCount: backendTerm.userTerms.length,
    createdAt: createdAt.toISOString(),
    isFavourite:
      userId != null &&
      backendTerm.userTerms.some((ut) => ut.userId === userId),
  };
}