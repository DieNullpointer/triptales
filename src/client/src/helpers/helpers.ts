export function cleanClasses(classes: string) {
    let classesArr = classes.replace(/(\s+|undefined)/g, ' ').trim();
    return classesArr;
}