import { useEffect, useState } from "react";

export type View = "roadmap" | "playlists";

const read = (): View => (window.location.hash === "#playlists" ? "playlists" : "roadmap");

/** Current top-level tab, kept in the URL hash (#roadmap / #playlists) so Back works. */
export function useHashView() {
  const [view, setView] = useState<View>(read);

  useEffect(() => {
    const onChange = () => {
      setView(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return view;
}
