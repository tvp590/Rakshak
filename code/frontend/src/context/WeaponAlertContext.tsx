import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import SocketClient from "../components/SocketClient";
import { WeaponAlertContextType } from "../types";

const defaultContextValue: WeaponAlertContextType = {
    alertMessage: null,
    alertDetails: null,
    simulateAlert : () => {}
};

const WeaponAlertContext = createContext<WeaponAlertContextType>(defaultContextValue);

export const WeaponAlertProvider = ({ children }: { children: ReactNode }) => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertDetails, setAlertDetails] = useState< Record<string, unknown> | null>(null);
    const socket = SocketClient();

    useEffect(() => {
        if (!socket) return;

        socket.on("weapon_alert", (data) => {
            console.log("Weapon detected:", data);

            setAlertMessage(data.message || "🚨 Weapon detected!");

            setAlertDetails(data);

            setTimeout(() => setAlertMessage(null), 15000);
        });

        return () => {
            socket.off("weapon_alert");
        };
    }, [socket]);

    const simulateAlert = (message: string, details: Record<string, unknown> ) => {
        setAlertMessage(message);
        setAlertDetails(details);
        setTimeout(() => setAlertMessage(null), 15000);
    };

    return (
        <WeaponAlertContext.Provider value={{ alertMessage, alertDetails , simulateAlert}}>
            {children}
        </WeaponAlertContext.Provider>
    );
};

export const useWeaponAlert = () => useContext(WeaponAlertContext);
