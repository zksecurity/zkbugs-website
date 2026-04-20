import { useMemo } from "react";
import { useBugs } from "./useBugs";

export const useBug = (bugId) => {
  const bugs = useBugs();

  return useMemo(() => {
    if (!bugs.length) {
      return { bug: null, similar: [], loading: true };
    }

    const decoded = (() => {
      try {
        return decodeURIComponent(bugId ?? "");
      } catch {
        return bugId ?? "";
      }
    })();

    const bug = bugs.find((b) => b.id === decoded) ?? null;
    const similar = (bug?.similarBugs ?? []).map((id) => {
      const match = bugs.find((b) => b.id === id);
      return match
        ? { id, title: match.title, dsl: match.dsl }
        : { id, title: id, dsl: null };
    });

    return { bug, similar, loading: false };
  }, [bugs, bugId]);
};
