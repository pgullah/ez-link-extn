import { Link } from './models';
import {defaultIfEmpty} from './utils';

let _STORE: any;
const STORE_KEY = '__ez-link-extn-store__'
const chromeStorageGet = async () => {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([STORE_KEY], (items) => {
            if (chrome.runtime.lastError) {
                return reject(Error(chrome.runtime.lastError.message));
            }
            return resolve(items);
        });
    });
    // return await chrome.storage.sync.get([STORE_KEY]);
}

const chromeStorageSet = async (settings: any) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [STORE_KEY]: settings }, () => {
            if (chrome.runtime.lastError) {
                return reject(Error(chrome.runtime.lastError.message));
            }
            return resolve(null);
        });
    });
    // await chrome.storage.sync.set({ STORE_KEY: settings });
}

const saveStore = async (settings: any) => {
    await chromeStorageSet(settings);
    _STORE = { ..._STORE, ...settings };
}

const loadStore = async () => {
    if (_STORE === undefined) {
        const items: any = await chromeStorageGet();
        _STORE = { ...items[STORE_KEY] }
    }
    return { ..._STORE };
}

const withStore = async (callback: any) => {
    const clonedStore = { ..._STORE };
    callback(clonedStore);
    await saveStore(clonedStore);
    _STORE = clonedStore;
}

export const findLink = (id: any) => {
    const entry = _STORE[id];
    if (!entry) {
        throw new Error(`Could not find entry ${id}`);
    }
    return { ...entry };
}

export const findAllLinks = async () => {
    const settings = await loadStore();
    const entries = [];
    for (const key in settings) {
        entries.push(settings[key]);
    }
    return entries;
}


export const saveLink = async (item: Link) => {
    const id = defaultIfEmpty(item.id, `${new Date().getTime()}`);
    await withStore((clonedStore: any) => clonedStore[id] = { ...item, id: id, });
    return id;
}

export const deleteLink = async (id: any,) => {
    const entry = findLink(id);
    await withStore((clonedStore: any) => delete clonedStore[entry.id]);
}

export const resetLinks = async () => {
    await saveStore({});
}

