import { useWeaponAlert } from "@/context/WeaponAlertContext";
import { motion } from "framer-motion";

const WeaponAlertNotification = () => {
    const { alertMessage } = useWeaponAlert();

    if (!alertMessage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: alertMessage ? 1 : 0, scale: alertMessage ? 1 : 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-3 px-6 rounded-lg shadow-lg text-sm font-semibold z-500 ${
                alertMessage ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
                minWidth: "200px",
            }}
        >
            {alertMessage}
        </motion.div>
    );
};

export default WeaponAlertNotification;
