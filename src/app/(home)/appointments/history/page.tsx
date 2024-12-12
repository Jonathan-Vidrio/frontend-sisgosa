import { PageContent } from '@/core';
import { AppointmentsHistory } from '@/modules/appointment/components/tables/appointments-history';

/**
 * Renders the Appointments History page.
 *
 * This page displays a table showing the history of appointments.
 *
 * @component
 */
export default function AppointmentsHistoryPage() {
  return (
    <PageContent title='Appointments History'>
      <AppointmentsHistory />
    </PageContent>
  );
}
