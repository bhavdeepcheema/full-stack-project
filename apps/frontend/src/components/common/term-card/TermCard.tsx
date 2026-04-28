import { FrontendTerm as Term } from "@shared/types/frontend-term";
import { SignedIn } from "@clerk/clerk-react";
import { CheckmarkIcon } from "../../../assets/checkmark-icon";
import { DiskIcon } from "../../../assets/disk-pen-svgrepo-com";

type TermCardProps = {
  term: Term;
  isExpanded: boolean;
  onTitleClick: (id: number) => void;
  onSaveClick: (id: number) => Promise<void>;
};

export function TermCard({
  term,
  isExpanded,
  onTitleClick,
  onSaveClick,
}: TermCardProps) {
  return (
    <div className="term-card">
      <div className="card-header">
        <h3 onClick={() => onTitleClick(term.id)}>
          {term.title}
        </h3>

        <span>
          {term.favouritesCount}{" "}
          {term.favouritesCount === 1 ? "favourite" : "favourites"}
        </span>

        <SignedIn>
          <button onClick={() => void onSaveClick(term.id)}>
            {term.isFavourite ? <CheckmarkIcon /> : <DiskIcon />}
          </button>
        </SignedIn>
      </div>

      {isExpanded ? <p>{term.definition}</p> : null}
    </div>
  );
}