import { useState, useRef, useCallback } from 'react';



export function useCooldown(durationMs: number) {

    const [onCooldown, setOnCooldown] = useState(false);
    const cooldownRef = useRef(false);

    const triggerCooldown = useCallback(() => {
        if (cooldownRef.current) return false;

        cooldownRef.current = true;
        setOnCooldown(true);

        setTimeout(() => {
            cooldownRef.current = false;
            setOnCooldown(false);
        }, durationMs);

        return true;
    }, [durationMs]);

    return { onCooldown, triggerCooldown };
}
