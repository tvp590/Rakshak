import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import SocketClient from "@/components/SocketClient";
import { WeaponAlertContextType, WeaponAlertData } from "../types";

const WeaponAlertContext = createContext<WeaponAlertContextType>({
    message: null,
    triggerMessage: () => {},
    highlightedFeedId: null,
});

export const WeaponAlertProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [highlightedFeedId, setHighlightedFeedId] = useState<number | null>(null);
    const socket = SocketClient();

    const triggerMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage(null);
        }, 15000);
    };

    useEffect(() => {
        if (!socket) return;

        const handleWeaponAlert = (data: WeaponAlertData) => {
            const cctvId = data?.cctv_id ?? "Unknown";
            const location = data?.location ?? "Unknown";
            triggerMessage(`🚨 Weapon detected!  CCTV ID: ${cctvId}, Location: ${location}`);
            if (cctvId) {
                setHighlightedFeedId(cctvId);
                setTimeout(() => setHighlightedFeedId(null), 15000);
            }
        };

        socket.on("weapon_alert", handleWeaponAlert);

        return () => {
            socket.off("weapon_alert");
        };
    }, [socket]);

    return (
        <WeaponAlertContext.Provider value={{ message, triggerMessage, highlightedFeedId }}>
            {children}
        </WeaponAlertContext.Provider>
    );
};

export const useWeaponAlert = () => useContext(WeaponAlertContext);
