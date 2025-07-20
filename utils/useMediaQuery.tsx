"use client";

import { useState, useLayoutEffect } from "react";

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  // ex query: min-width: 1280px
  // although this file is set as "use client", react can render before the browser's window is ready
  // useEffect makes sure the component is mounted and avoid errors with using window
  useLayoutEffect(() => {
    const media = window.matchMedia(query);
    // returns a mediaQueryList object
    //      MediaQueryList {
    //   matches: true,
    //   media: "(min-width: 1280px)",
    //   onchange: null,
    //   addEventListener: fn(),
    //   removeEventListener: fn()
    // }

    // to see if there it a match, we look at the matches property, then update our state to true or false
    const handleChange = () => setMatches(media.matches);
    // handleChange is a callback that will update react's state whenever the window is resized enough that our media queries result changes ( aka goes below or above min-width: 1280px)
    // react will retrigger a rerender if media.handleChange() change's its state

    handleChange();
    media.addEventListener("change", handleChange);
    // "change" === listening for screen changes

    return () => media.removeEventListener("change", handleChange);
    // that that event listener's effect is triggered, it will remove the event listener to avoid memory leaks or duplicate listeners (if we were running this more than once)
  }, [query]);
  // our query is static so just use [], if we wanted it to be dynamic we'd add that to the dependency array. It runs once on mount

  return matches;
}
