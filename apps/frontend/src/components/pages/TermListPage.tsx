import { useState } from "react";
import { createPortal } from "react-dom";
import { FrontendTerm as Term } from "@shared/types/frontend-term";

import { useTerms } from "../../hooks/useTerms";
import { usePopup } from "../../hooks/usePopup";
import PopupMessage from "../common/popup-message/PopupMessage";
import { TermListDisplay } from "../common/term-list-display/TermListDisplay";

type TermListPageProps = {
  title: string;
  dependencies: unknown[];
  filterFn: ((term: Term) => boolean) | null;
};

/**
 * this "wrapper" page allows us to explicitly set page filters without
 * having to restate the save function on click
 */
export function TermListPage({
  title,
  dependencies,
  filterFn,
}: TermListPageProps) {
  const { terms, error, toggleFavouriteTerm } = useTerms(dependencies, filterFn);
  const { popupVisible, popupText, showPopupWithText } = usePopup();

  const [sortBy, setSortBy] = useState<"alphabetical" | "favourites" | "recent">(
    "alphabetical"
  );

  const handleSaveClick = async (id: number) => {
    const clickedTerm = terms.find((t) => t.id === id);

    await toggleFavouriteTerm(id);

    if (!clickedTerm) {
      showPopupWithText("Error getting term.");
      return;
    }

    showPopupWithText(
      clickedTerm.isFavourite
        ? `Removed ${clickedTerm.title} from favourites`
        : `Added ${clickedTerm.title} to favourites`
    );
  };

  const sortedTerms = [...terms].sort((a, b) => {
    switch (sortBy) {
      case "favourites":
        return b.favouritesCount - a.favouritesCount;
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "alphabetical":
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return (
    <>
      <h2>{title}</h2>

      <div>
        <label htmlFor="sortTerms">Sort by: </label>
        <select
          id="sortTerms"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "alphabetical" | "favourites" | "recent")
          }
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="favourites">Most Favourites</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      <div>
        {error ? (
          <span className="error">Something went wrong: ({error})</span>
        ) : sortedTerms.length === 0 ? (
          <span>No terms found.</span>
        ) : (
          <TermListDisplay
            terms={sortedTerms}
            onSaveClick={async (id: number) => {
              await handleSaveClick(id);
            }}
          />
        )}
      </div>

      {popupVisible &&
        createPortal(<PopupMessage message={popupText} />, document.body)}
    </>
  );
}