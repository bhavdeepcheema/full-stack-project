import { useState } from "react";
import { TermCard } from "../term-card/TermCard";
import { FrontendTerm as Term } from "@shared/types/frontend-term";

type TermListDisplayProps = {
  terms: Term[];
  onSaveClick: (id: number) => Promise<void>;
};

export function TermListDisplay({
  terms,
  onSaveClick,
}: TermListDisplayProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const termListItems = terms.map((term) => {
    return (
      <TermCard
        key={term.id}
        term={term}
        isExpanded={term.id === expandedId}
        onTitleClick={() => {
          term.id !== expandedId
            ? setExpandedId(term.id)
            : setExpandedId(null);
        }}
        onSaveClick={onSaveClick}
      />
    );
  });

  return <ol className="terms-list">{termListItems}</ol>;
}