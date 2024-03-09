import { useEffect, useState, RefObject } from "react";

// Originally copied from: https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/14-useOnScreen/useOnScreen.js
// Converted to typescript by Bing AI

export default function useOnScreen(ref: RefObject<Element>, rootMargin: string = "0px"): boolean {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin }
        );

        observer.observe(ref.current);

        return () => {
            if (!ref.current) return;
            observer.unobserve(ref.current);
        };
    }, [ref, rootMargin]);

    return isVisible;
}
