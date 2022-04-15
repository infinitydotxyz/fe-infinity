/**
 * Simple component to group multiple socials input fields together with addicate spacing.
 */
export const SocialsInputGroup: React.FC = ({ children }) => {
  return <div className="flex flex-col md:flex-row justify-between space-x-4">{children}</div>;
};

export default SocialsInputGroup;
