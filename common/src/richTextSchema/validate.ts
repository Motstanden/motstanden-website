import { CustomElement, Descendant, ElementType, FormattedText } from "./index.js"

export function isValidRichText(children: Descendant[]) {
    for (let i = 0; i < children.length; i++) {
        if (!isValidElement(children[i])) {
            return false
        }
    }
    return true;
}

function isValidElement(element: Descendant): element is CustomElement {

    if (!("type" in element)) {
        return false
    }

    if (!Object.values(ElementType).includes(element.type)) {
        return false
    }

    if (!("children" in element)) {
        return false
    }

    if (!Array.isArray(element.children)) {
        return false
    }

    if (element.children.length === 0) {
        return false
    }

    const isList: boolean = element.type === ElementType.BulletedList || element.type === ElementType.NumberedList
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i]
        const isValid = isList ? isValidElement(child) : isValidText(child)
        if (!isValid) {
            return false
        }
    }

    return true;
}

function isValidText(text: Descendant): text is FormattedText {
    if (!("text" in text)) {
        return false
    }

    if (typeof text.text !== "string") {
        return false
    }

    return true
}