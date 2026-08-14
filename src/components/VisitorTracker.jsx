import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const VisitorTracker = () => {
    const location = useLocation();
    const intervalRef = useRef(null);
    const lastPingTimeRef = useRef(Date.now());

    const getOrCreateVisitorId = () => {
        let vid = localStorage.getItem('visitor_uuid_v1');
        if (!vid) {
            vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
            localStorage.setItem('visitor_uuid_v1', vid);
        }
        return vid;
    };

    const getOrCreateSessionId = () => {
        let sid = sessionStorage.getItem('session_uuid_v1');
        let isNewSession = false;
        if (!sid) {
            sid = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
            sessionStorage.setItem('session_uuid_v1', sid);
            isNewSession = true;
        }
        return { sessionId: sid, isNewSession };
    };

    const sendPing = (durationSec = 0, isNewSession = false) => {
        // Do not track admin page visitors or bot crawlers
        if (location.pathname.startsWith('/admin')) return;

        const visitorId = getOrCreateVisitorId();
        const { sessionId } = getOrCreateSessionId();

        const payload = JSON.stringify({
            visitorId,
            sessionId,
            currentPath: location.pathname || '/',
            pageTitle: document.title || 'Portfolio',
            durationIncrement: durationSec,
            isNewSession
        });

        if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon('/api/track-visitor', blob);
        } else {
            fetch('/api/track-visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
            }).catch(() => {});
        }
    };

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) return;

        const { isNewSession } = getOrCreateSessionId();
        lastPingTimeRef.current = Date.now();

        // Initial track call when route changes
        sendPing(0, isNewSession);

        // Heartbeat ping every 10 seconds to accumulate duration accurately
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const elapsedSec = Math.round((now - lastPingTimeRef.current) / 1000);
            if (elapsedSec > 0) {
                sendPing(elapsedSec, false);
                lastPingTimeRef.current = now;
            }
        }, 10000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                const now = Date.now();
                const elapsedSec = Math.round((now - lastPingTimeRef.current) / 1000);
                if (elapsedSec > 0) {
                    sendPing(elapsedSec, false);
                    lastPingTimeRef.current = now;
                }
            } else if (document.visibilityState === 'visible') {
                lastPingTimeRef.current = Date.now();
            }
        };

        const handleBeforeUnload = () => {
            const now = Date.now();
            const elapsedSec = Math.round((now - lastPingTimeRef.current) / 1000);
            if (elapsedSec > 0) {
                sendPing(elapsedSec, false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);

            // Final ping for route transition
            const now = Date.now();
            const elapsedSec = Math.round((now - lastPingTimeRef.current) / 1000);
            if (elapsedSec > 0) {
                sendPing(elapsedSec, false);
            }
        };
    }, [location.pathname]);

    return null;
};

export default VisitorTracker;
