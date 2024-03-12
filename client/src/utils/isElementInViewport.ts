export function isElementInViewport( element: HTMLElement | HTMLDivElement | undefined | null ) {

    if( !element ) 
        return false

    const rect = element.getBoundingClientRect()
    const inView = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
    return inView;
}