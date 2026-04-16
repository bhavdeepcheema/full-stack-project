import { useTerms } from "../../hooks/useTerms";
import { FrontendTerm as Term } from "@shared/types/frontend-term";
import { createPortal } from "react-dom";
import { usePopup } from "../../hooks/usePopup";
import PopupMessage from "../common/popup-message/PopupMessage";
import { TermListDisplay } from "../common/term-list-display/TermListDisplay";
import { useState } from "react";

/** 
 * this "wrapper" page allows us to explicitly set page filters without
 * having to restate the save function on click
 */
export function TermListPage(
    {title, dependencies, filterFn}:
    {
       title: string,
       dependencies: any[],
       filterFn: ((term: Term) => Boolean)|null,
    } 
) {
    const { terms, error, toggleFavouriteTerm } = useTerms(dependencies, filterFn);

    const {popupVisible, popupText, showPopupWithText} = usePopup();

    const displayTogglePopup = (id: Number) => {
        const toggledTerm = terms.find(t => t.id === id);
        let newPopupText = "";
        if(!toggledTerm) {
            newPopupText = "Error getting term.";
        } else {
            newPopupText = toggledTerm?.isFavourite ? 
                `Removed ${toggledTerm.title} from favourites`: 
                `Added ${toggledTerm.title} to favourites`  
            ;
        }
        showPopupWithText(newPopupText);
    }

    const handleSaveClick = async (id: number) => {
        await toggleFavouriteTerm(id);
        displayTogglePopup(id);
    }

    const [sortBy, setSortBy] = useState<"alphabetical" | "favourites" | "recent">("alphabetical");

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


    return(
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
                {error ? 
                    <span className="error">Something went wrong: ({error})</span>:
                    <TermListDisplay 
                        terms={sortedTerms} 
                        onSaveClick={ 
                            async (id: number) => {
                                await handleSaveClick(id);
                            }
                        } 
                    />
                }
            </div>
            {/* short-circuit method for creating portal conditionally */}
            {popupVisible && createPortal(
                <PopupMessage message={popupText} />
            , document.body)}
        </>
    )
}