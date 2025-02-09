import { motion } from 'framer-motion';

/**
 * TontineCard is a functional React component that represents a card displaying information
 * about a tontine, including its name and cycle size.
 * It incorporates motion effects for hover and tap interactions.
 *
 * @param {Object} props - The properties object passed to the component.
 * @param {string} props.name - The name of the tontine to be displayed.
 * @param {number} props.cycleSize - The size of the tontine's cycle, in days.
 * @returns {JSX.Element} A styled card component containing the tontine's name and cycle size.
 */
export const TontineCard = ({ name, cycleSize }) => (
    <motion.div
        className="p-4 rounded-xl glassmorphism card-hover"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-300">{cycleSize} days</p>
    </motion.div>
);
