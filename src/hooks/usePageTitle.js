import { useEffect } from "react";

const DEFAULT_TITLE = "Movie Explorer";

function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  }, [title]);
}

export default usePageTitle;
