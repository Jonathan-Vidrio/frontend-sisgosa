import { BackButton } from './back-button';

/**
 * @function PageContent
 * @description Component that renders the content of a page with a title and a back button
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - Title of the page
 * @param {React.ReactNode} props.children - Content of the page
 * @param {string} [props.className] - Additional CSS classes for the content container
 * @returns {JSX.Element} Rendered page content component
 */
export const PageContent = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }): JSX.Element => {
  return (
    <div>
      <div className='flex flex-row items-center gap-x-5'>
        <BackButton />
        <h1 className='text-2xl font-bold'>{title}</h1>
      </div>

      <div className={`mt-10 ${className}`}>{children}</div>
    </div>
  );
};
