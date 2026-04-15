import { isDevMode } from '@angular/core';

export const API_CONFIG = {
    baseUrl: isDevMode()
        ? '/api' // Uses proxy.conf.json in local dev
        : 'https://apna-tution-backend.vercel.app'
};
