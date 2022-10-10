import { Location as RouterLocation, resolvePath } from "react-router-dom";

/**
 * Checks if a react-router-dom path pattern matches the current url
 * @param pattern The react-router-dom pattern to match, I.E: /user/:userId
 * @param location The current url location. Can be retrieved using the useLocation() hook in react-router-dom
 * @param options 
 * @returns True if the path is a match, otherwise false
 */
export function matchUrl(
    pattern: string,
    location: RouterLocation,
    options?: {
        matchChildPath?: boolean;
    }
) {
    // This logic is heavily inspired NavLink in react-router-dom: 
    //      https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx

    const path = resolvePath(pattern);
    const locationPathname = location.pathname.toLowerCase();
    const toPathname = path.pathname.toLowerCase();

    const isExact = locationPathname === toPathname;
    const isChild = options?.matchChildPath && (locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/");

    return isExact || isChild;
}