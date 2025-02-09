/**
 * LoadingSpinner is a functional React component that displays a centered loading animation.
 * It uses a `div` element styled with Tailwind CSS classes to create a spinner effect.
 * The spinner is visually represented as a rounded, spinning element with a border.
 */
export const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
);
