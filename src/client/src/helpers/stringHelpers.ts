export function cleanClasses(classes: string) {
    let classesArr = classes.replace(/(\s+|undefined)/g, ' ').trim();
    return classesArr;
}
export function formatDateEuropean(date: Date) {
    var d = new Date(date);
    return d.getDate() + "." + (d.getUTCMonth() + 1) + "." + d.getFullYear();
}