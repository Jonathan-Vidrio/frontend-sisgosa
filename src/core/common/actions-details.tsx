'use client';

import { useUiStore } from '@/store';
import { CustomButton } from './custom-button';
import { useRouter } from 'next/navigation';

interface Props {
  isActivated?: boolean;
  href?: string;
  canUpdate?: boolean;
  canDelete?: boolean;
  handleDelete?: () => void;
}

/**
 * @function ActionsDetails
 * @description Component that renders action buttons for updating or deleting an item
 *
 * @param {Object} props - Component properties
 * @param {boolean} [props.isActivated] - Flag indicating if the item is activated
 * @param {string} [props.href] - URL to navigate to for updating the item
 * @param {boolean} [props.canUpdate] - Flag indicating if the item can be updated
 * @param {boolean} [props.canDelete] - Flag indicating if the item can be deleted
 * @param {function} [props.handleDelete] - Callback function to handle item deletion
 * @returns {JSX.Element} Rendered action buttons
 */
export const ActionsDetails = ({ isActivated, href, canUpdate, canDelete, handleDelete }: Props): JSX.Element => {
  const { showLoading } = useUiStore(state => state);

  const router = useRouter();

  return (
    <div className='space-y-5'>
      {canDelete && (
        <CustomButton color={isActivated ? '' : 'red'} onClick={handleDelete}>
          {isActivated ? 'Activate' : 'Deactivate'}
        </CustomButton>
      )}

      {canUpdate && !isActivated && href && (
        <CustomButton
          onClick={() => {
            router.push(href);
            showLoading();
          }}
        >
          Modify
        </CustomButton>
      )}
    </div>
  );
};
