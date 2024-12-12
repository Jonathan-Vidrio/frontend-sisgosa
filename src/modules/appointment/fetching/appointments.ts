import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  getAppointmentsByClient,
  getAppointmentsByWorker,
  getAppointmentsHistory,
  getAppointmentsHistoryByClient,
  getAppointmentsHistoryByWorker,
  getAvailableDates,
  getDeletedAppointments,
  getDeletedAppointmentsByClient,
  getDeletedAppointmentsByWorker,
  restoreAppointment,
  updateAppointment,
} from '@/app/lib/actions/appointments/appointmenst';
import { createError } from '@/helpers';
import { useAppointmentsStore, useModalStore, useUiStore } from '@/store';
import { Appointment } from '@/interfaces';

export async function fetchGetAvailableDates(days: number): Promise<(string | Date)[]> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getAvailableDates(days);
    if (response && 'error' in response) throw new Error(response.error);

    const { dates } = response;

    // convert dates to local time
    dates.forEach((date, index) => {
      dates[index] = new Date(date);
    });

    const now = new Date();
    const sixPmToday = new Date(now);
    sixPmToday.setHours(18, 0, 0, 0);

    const filteredDates = dates.filter(date => {
      if (new Date(date).toDateString() === now.toDateString() && now > sixPmToday) return false;

      return true;
    });

    return filteredDates;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointments(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setAppointments } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getAppointments();
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setAppointments(appointments);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointmentsHistory(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getAppointmentsHistory();
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setHistory(appointments);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedAppointments(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getDeletedAppointments();
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setHistory(appointments);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointmentsByClient(clientId: string): Promise<Appointment[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setAppointments } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getAppointmentsByClient(clientId);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setAppointments(appointments);

    return appointments;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointmentsHistoryByClient(clientId: string): Promise<Appointment[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getAppointmentsHistoryByClient(clientId);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setHistory(appointments);

    return appointments;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedAppointmentsByClient(clientId: string): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getDeletedAppointmentsByClient(clientId);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setHistory(appointments);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointmentsByWorker(workerId: string): Promise<Appointment[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setAppointments } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getAppointmentsByWorker(workerId);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setAppointments(appointments);

    return appointments;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointmentsHistoryByWorker(workerId: string): Promise<Appointment[]> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getAppointmentsHistoryByWorker(workerId);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setHistory(appointments);

    return appointments;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetDeletedAppointmentsByWorker(workerId: string): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setHistory } = useAppointmentsStore.getState();

  try {
    showLoading();

    const response = await getDeletedAppointmentsByWorker(workerId);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointments } = response;

    setHistory(appointments);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchGetAppointmentById(id: string): Promise<Appointment> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await getAppointmentById(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointment } = response;

    return appointment;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchCreateAppointment(data: Appointment): Promise<Appointment> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess: setIsSucces } = useModalStore.getState();

  try {
    showLoading();

    const response = await createAppointment({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { appointment } = response;

    setIsSucces();
    setChildren(`Appointment has been created.`);
    openModal();

    await fetchGetAppointments();

    return appointment;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchUpdateAppointment(id: string, data: Appointment): Promise<Appointment> {
  const { showLoading, hideLoading } = useUiStore.getState();
  const { openModal, setChildren, setIsSuccess } = useModalStore.getState();

  console.log('fetchUpdateAppointment', data);

  try {
    showLoading();

    const response = await updateAppointment(id, { ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { appointment } = response;

    setIsSuccess();
    setChildren(`Appointment has been updated.`);
    openModal();

    await fetchGetAppointments();

    return appointment;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchDeleteAppointment(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await deleteAppointment(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    await fetchGetAppointments();

    return !!message;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

export async function fetchRestoreAppointment(id: string): Promise<boolean> {
  const { showLoading, hideLoading } = useUiStore.getState();

  try {
    showLoading();

    const response = await restoreAppointment(id);
    if (response && 'error' in response) throw new Error(response.error);

    const { appointment } = response;

    await fetchGetAppointments();

    return !!appointment;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}
