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