import {defaultIfEmpty} from './utils';

let _STORE;
const STORE_KEY = '__ez-link-extn-store__'
const chromeStorageGet = async () => {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([STORE_KEY], (items) => {
            if (chrome.runtime.lastError) {
                return reject(Error(chrome.runtime.lastError));
            }
            return resolve(items);
        });
    });
    // return await chrome.storage.sync.get([STORE_KEY]);
}

const chromeStorageSet = async (settings) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [STORE_KEY]: settings }, () => {
            if (chrome.runtime.lastError) {
                return reject(Error(chrome.runtime.lastError));
            }
            return resolve();
        });
    });
    // await chrome.storage.sync.set({ STORE_KEY: settings });
}

const saveStore = async (settings) => {
    await chromeStorageSet(settings);
    _STORE = { ..._STORE, ...settings };
}

const loadStore = async () => {
    if (_STORE === undefined) {
        const items = await chromeStorageGet();
        _STORE = { ...items[STORE_KEY] }
    }
    return { ..._STORE };
}

const withStore = async (callback) => {
    const clonedStore = { ..._STORE };
    callback(clonedStore);
    await saveStore(clonedStore);
    _STORE = clonedStore;
}

export const findLink = (id) => {
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


export const saveLink = async (item) => {
    const id = defaultIfEmpty(item.id, `${new Date().getTime()}`);
    await withStore(clonedStore => clonedStore[id] = { ...item, id: id, });
    return id;
}

export const deleteLink = async (id,) => {
    const entry = findLink(id);
    await withStore(clonedStore => delete clonedStore[entry.id]);
}

