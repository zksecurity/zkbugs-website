import { useEffect, useState } from "react";

export const useScrollDetection = (callback) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        callback?.(true);
        setIsScrolled(true);
      } else {
        callback?.(false);
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);

  return isScrolled;
};
