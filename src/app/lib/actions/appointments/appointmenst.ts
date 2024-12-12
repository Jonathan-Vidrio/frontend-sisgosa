'use server';

import { Appointment } from '@/interfaces';
import { getAccessSession } from '../auth/auth';
import { httpRequest } from '@/helpers';

/**
 * Fetches available appointment dates for a specified number of days.
 *
 * @async
 * @param {number} days - The number of days to fetch available dates for.
 * @returns {Promise<{ dates: Date[] | string[] } | { error: string }>} The available dates or an error message.
 */
export async function getAvailableDates(days: number): Promise<{ dates: Date[] | string[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const dates = await httpRequest({
      url: `/appointments/available-dates/${days}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { dates };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches all appointments.
 *
 * @async
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The list of appointments or an error message.
 */
export async function getAppointments(): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: '/appointments',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches the appointment history.
 *
 * @async
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The appointment history or an error message.
 */
export async function getAppointmentsHistory(): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: '/appointments/history',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches deleted appointments.
 *
 * @async
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The deleted appointments or an error message.
 */
export async function getDeletedAppointments(): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: '/appointments/deleted',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches appointments for a specific client.
 *
 * @async
 * @param {string} clientId - The ID of the client.
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The client's appointments or an error message.
 */
export async function getAppointmentsByClient(clientId: string): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: `/appointments/client/${clientId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches the appointment history for a specific client.
 *
 * @async
 * @param {string} clientId - The ID of the client.
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The client's appointment history or an error message.
 */
export async function getAppointmentsHistoryByClient(clientId: string): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: `/appointments/history/client/${clientId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches deleted appointments for a specific client.
 *
 * @async
 * @param {string} clientId - The ID of the client.
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The client's deleted appointments or an error message.
 */
export async function getDeletedAppointmentsByClient(clientId: string): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: `/appointments/deleted/client/${clientId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches appointments for a specific worker.
 *
 * @async
 * @param {string} workerId - The ID of the worker.
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The worker's appointments or an error message.
 */
export async function getAppointmentsByWorker(workerId: string): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: `/appointments/worker/${workerId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches the appointment history for a specific worker.
 *
 * @async
 * @param {string} workerId - The ID of the worker.
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The worker's appointment history or an error message.
 */
export async function getAppointmentsHistoryByWorker(workerId: string): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: `/appointments/history/worker/${workerId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches deleted appointments for a specific worker.
 *
 * @async
 * @param {string} workerId - The ID of the worker.
 * @returns {Promise<{ appointments: Appointment[] } | { error: string }>} The worker's deleted appointments or an error message.
 */
export async function getDeletedAppointmentsByWorker(workerId: string): Promise<{ appointments: Appointment[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointments = await httpRequest({
      url: `/appointments/deleted/worker/${workerId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointments };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches a specific appointment by its ID.
 *
 * @async
 * @param {string} id - The ID of the appointment.
 * @returns {Promise<{ appointment: Appointment } | { error: string }>} The appointment details or an error message.
 */
export async function getAppointmentById(id: string): Promise<{ appointment: Appointment } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointment = await httpRequest({
      url: `/appointments/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointment };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Creates a new appointment.
 *
 * @async
 * @param {Appointment} data - The data for the new appointment.
 * @returns {Promise<{ appointment: Appointment } | { error: string }>} The created appointment or an error message.
 */
export async function createAppointment(data: Appointment): Promise<{ appointment: Appointment } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointment = await httpRequest({
      url: '/appointments',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { appointment };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Updates an existing appointment.
 *
 * @async
 * @param {string} id - The ID of the appointment.
 * @param {Appointment} data - The updated data for the appointment.
 * @returns {Promise<{ appointment: Appointment } | { error: string }>} The updated appointment or an error message.
 */
export async function updateAppointment(id: string, data: Appointment): Promise<{ appointment: Appointment } | { error: string }> {
  console.log('updateAppointment', data);
  try {
    const { user, accessToken } = await getAccessSession();

    const appointment = await httpRequest({
      url: `/appointments/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { appointment };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Deletes an appointment.
 *
 * @async
 * @param {string} id - The ID of the appointment to delete.
 * @returns {Promise<{ message: string } | { error: string }>} A success message or an error message.
 */
export async function deleteAppointment(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/appointments/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Restores a deleted appointment.
 *
 * @async
 * @param {string} id - The ID of the appointment to restore.
 * @returns {Promise<{ appointment: Appointment } | { error: string }>} The restored appointment or an error message.
 */
export async function restoreAppointment(id: string): Promise<{ appointment: Appointment } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const appointment = await httpRequest({
      url: `/appointments/restore/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { appointment };
  } catch (error: any) {
    return { error: error.message };
  }
}
