import { useStatusesStore, useUiStore } from '@/store';
import { createError } from '@/helpers';
import { getStatuses } from '@/app/lib/actions/statuses/statuses';

export async function fetchGetStatuses(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setStatuses } = useStatusesStore.getState();

  try {
    showLoading();

    const response = await getStatuses();
    if (response && 'error' in response) throw new Error(response.error);

    const { statuses } = response;

    setStatuses(statuses);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
