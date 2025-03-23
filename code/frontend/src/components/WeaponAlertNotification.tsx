import { useWeaponAlert } from "@/context/WeaponAlertContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WeaponAlertNotification = () => {
    const { message } = useWeaponAlert();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(!!message);
    }, [message]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="d-flex justify-content-between align-items-center position-fixed top-0 start-50 translate-middle-x mt-5 px-4 py-3 shadow rounded-3"
                    style={{
                        zIndex: 5000,
                        backgroundColor: "#b30000",
                        color: "white",
                        width: "90vw",
                        maxWidth: "600px",
                        fontWeight: 500,
                    }}
                >
                    <span>{message}</span>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="btn-close btn-close-white ms-3"
                        aria-label="Close"
                    ></button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WeaponAlertNotification;
