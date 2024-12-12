/**
 * @function Filters
 * @description Component that renders a container for filter elements
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode | string} props.children - Filter content
 * @param {string} [props.className] - Additional CSS classes for the container
 * @returns {JSX.Element} Rendered filter container
 */
export const Filters = ({ children, className }: { children: React.ReactNode | string; className?: string }): JSX.Element => {
  return <div className={`fixed w-[400px] z-10 bg-white shadow-xl rounded-md p-5 my-2 space-y-3 ${className}`}>{children}</div>;
};
