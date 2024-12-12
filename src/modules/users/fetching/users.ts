import { useModalStore, useUiStore, useUsersStore } from '@/store';
import { createError } from '@/helpers';
import { User } from '@/interfaces';
import { createUser, deleteUser, getDeletedUsers, getUser, getUserByEmail, getUsers, restoreUser, updateUser } from '@/app/lib/actions/users/users';
import { fetchGetAppointments } from '@/modules/appointment/fetching/appointments';
import { fetchGetServices } from '@/modules/services/fetching/services';
import { fetchGetClients } from './clients';
import { fetchGetWorkers } from './workers';

export async function fetchGetUsers(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setUsers } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getUsers();
    if (response && 'error' in response) throw new Error(response.error);

    const { users } = response;

    setUsers(users);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedUsers(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setUsers } = useUsersStore.getState();

  try {
    showLoading();

    const response = await getDeletedUsers();
    if (response && 'error' in response) throw new Error(response.error);

    const { users } = response;

    setUsers(users);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetUser(id: string): Promise<User> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getUser(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    return user;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetUserByEmail(email: string): Promise<User> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getUserByEmail(email);
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    return user;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateUser(data: User): Promise<User> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await createUser(data);
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    setIsSucces();
    setChildren(`User ${user.firstName} ${user.firstSurname} has been created.`);
    openModal();

    await fetchGetUsers();
    await fetchGetClients();
    await fetchGetWorkers();

    return user;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

// show modal with success message
export async function fetchUpdateUser(id: string, data: User): Promise<User> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await updateUser(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    setIsSucces();
    setChildren(`User ${user.firstName} ${user.firstSurname} has been updated.`);
    openModal();

    await fetchGetUsers();
    await fetchGetClients();
    await fetchGetWorkers();

    return user;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

// show modal with success message
export async function fetchDeleteUser(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await deleteUser(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    setIsSucces();
    setChildren(message);
    openModal();

    await fetchGetUsers();
    await fetchGetClients();
    await fetchGetWorkers();
    await fetchGetAppointments();
    await fetchGetServices();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

// show modal with success message
export async function fetchRestoreUser(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await restoreUser(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    setIsSucces();
    setChildren(`User ${user.firstName} ${user.firstSurname} has been restored.`);
    openModal();

    await fetchGetUsers();
    await fetchGetClients();
    await fetchGetWorkers();

    return !!user;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
