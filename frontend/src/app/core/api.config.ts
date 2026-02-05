import { isDevMode } from '@angular/core';

export const API_CONFIG = {
    baseUrl: isDevMode()
        ? 'http://localhost:5000'
        : 'https://apna-tution-backend.vercel.app' // Replace with actual production backend URL
};
