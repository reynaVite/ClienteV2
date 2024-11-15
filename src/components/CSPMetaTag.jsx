import React, { useEffect } from 'react';

export function CSPMetaTag() {
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = `
            default-src 'self'; 
            script-src 'self' https://apis.google.com https://www.gstatic.com https://www.google.com https://cdn.jsdelivr.net https://www.googletagmanager.com; 
            style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/npm/antd@5.11.3/dist/antd.css; 
            font-src 'self' https://cdn.jsdelivr.net/npm/antd@5.11.3/dist/fonts/; 
            img-src 'self' *; 
            connect-src 'self' http://localhost:3000 https://servidor-zonadoce.vercel.app https://servidor-zona12-api.vercel.app https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com https://firebase.googleapis.com https://fcm.googleapis.com https://fcmregistrations.googleapis.com https://www.google-analytics.com https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188 https://api.hunter.io https://firebasestorage.googleapis.com https://securetoken.googleapis.com; 
            frame-src 'self' https://www.google.com https://apis.google.com https://eduzona-ba7dd.firebaseapp.com; 
            form-action 'self';
        `.replace(/\n/g, ' ').trim();

        document.head.appendChild(meta);

        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    return null;
}
