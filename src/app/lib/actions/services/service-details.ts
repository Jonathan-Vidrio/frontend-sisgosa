'use server';

import { httpRequest } from '@/helpers';
import { getAccessSession } from '../auth/auth';
import { ServiceDetail } from '@/interfaces';

export async function getServicesDetailsByService(serviceId: string): Promise<{ serviceDetails: ServiceDetail[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceDetails = await httpRequest({
      url: `/service-details/service/${serviceId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceDetails };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDeletedServicesDetailsByService(serviceId: string): Promise<{ serviceDetails: ServiceDetail[] } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceDetails = await httpRequest({
      url: `/service-details/service/deleted/${serviceId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceDetails };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getServiceDetail(id: string): Promise<{ serviceDetail: ServiceDetail } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceDetail = await httpRequest({
      url: `/service-details/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceDetail };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createServiceDetail(data: ServiceDetail): Promise<{ serviceDetail: ServiceDetail } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceDetail = await httpRequest({
      url: '/service-details',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { serviceDetail };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateServiceDetail(id: string, data: ServiceDetail): Promise<{ serviceDetail: ServiceDetail } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceDetail = await httpRequest({
      url: `/service-details/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { ...data },
    });

    return { serviceDetail };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteServiceDetail(id: string): Promise<{ message: string } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const { message } = await httpRequest({
      url: `/service-details/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function restoreServiceDetail(id: string): Promise<{ serviceDetail: ServiceDetail } | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    const serviceDetail = await httpRequest({
      url: `/service-details/restore/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { serviceDetail };
  } catch (error: any) {
    return { error: error.message };
  }
}
