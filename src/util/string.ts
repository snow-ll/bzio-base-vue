export function isEmptyString(string: string) {
    if (
        string == undefined ||
        typeof string == 'undefined' ||
        !string ||
        string == null ||
        string == '' ||
        /^\s+$/gi.test(string)
    ) {
        return true;
    } else {
        return false;
    }
}
