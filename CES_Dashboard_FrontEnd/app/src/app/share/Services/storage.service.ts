import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    setObjectInStorage(key: string, value: object) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    getObjectFromStorage(key: string, value: object) {
        const obj = sessionStorage.getItem(key);
        if (obj && obj != null) {
            return JSON.parse(obj);
        }
        return null;
    }

    setInStorage(key: string, value: string) {
        sessionStorage.setItem(key, value);
    }

    getFromStorage(key: any) {
        return sessionStorage.getItem(key);
    }

    removeFromStorage(key: any) {
        sessionStorage.removeItem(key);
    }

    clearFullStorage() {
        sessionStorage.clear();
    }
}
