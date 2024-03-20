import { Image } from "@/types/types";

export function cleanClasses(classes: string) {
    let classesArr = classes.replace(/(\s+|undefined)/g, ' ').trim();
    return classesArr;
}
export function formatDateEuropean(date: Date) {
    var d = new Date(date);
    return d.getDate() + "." + (d.getUTCMonth() + 1) + "." + d.getFullYear();
}
export function buildBase64Image(img: Image) {
    return `data:${img.contentType};base64, ${img.fileContents}`;
}

export function usernameValid(string: string) {
    return new RegExp(/^[a-z0-9_.-]{0,40}$/).test(string);
}