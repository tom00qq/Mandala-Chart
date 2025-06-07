import { useEffect, type RefObject } from "react";

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = <T extends HTMLDivElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    let startedInside: boolean = false;
    let startedWhenMounted: boolean = false;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      handler(event);
    };

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = !!ref.current;
      startedInside = !!(
        ref.current && ref.current.contains(event.target as Node)
      );
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
