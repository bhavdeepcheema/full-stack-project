import { TermListPage } from "./TermListPage";
import { useUser } from "@clerk/clerk-react";
import { NotSignedIn } from "../common/not-signed-in/NotSignedIn";

export function MyTerms() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <NotSignedIn />;
  }

  return (
    <main>
      <TermListPage
        title="My Terms"
        dependencies={[isSignedIn]}
        filterFn={null}
      />
    </main>
  );
}