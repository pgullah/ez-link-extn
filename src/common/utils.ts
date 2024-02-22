export const isEmpty = (obj: any) => (obj === undefined || obj === null || (typeof obj === 'string' && obj.trim() === ''));

export const defaultIfEmpty = (obj:any, defaultValue:any) => isEmpty(obj) ? defaultValue : obj;

export const ifExists = (value: any, nonNullCallback: (arg: any) => any) => value ? nonNullCallback(value) : value;

export const toBoolean = (val: any) => val === 'true' ? true: false;