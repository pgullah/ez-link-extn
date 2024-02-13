export const isEmpty = (obj) => (obj === undefined || obj === null || (typeof obj === 'string' && obj.trim() === ''));

export const defaultIfEmpty = (obj, defaultValue) => isEmpty(obj) ? defaultValue : obj;

export const ifExists = (value, nonNullCallback) => {
    return value ? value: nonNullCallback(value);
}