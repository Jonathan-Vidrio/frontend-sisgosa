import { PageContent } from '@/core';
import { AppointmentsTable } from '@/modules/appointment/components/tables/appointments-table';

/**
 * Renders the Appointments page.
 *
 * This page displays a table listing all appointments.
 *
 * @component
 */
export default function AppointmentsPage() {
  return (
    <PageContent title='Appointments'>
      <AppointmentsTable />
    </PageContent>
  );
}
