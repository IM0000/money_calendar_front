import { CalendarTable } from '../components/Calendar/CalendarTable/CalendarTable';
import SideCalendar from '../components/Calendar/SideCalendar/SideCalendar';
import Layout from '../components/Layout/Layout';

export default function MainPage() {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row">
        <div className="mb-4 flex w-full justify-center pl-4 lg:block lg:max-w-xs lg:justify-center">
          <SideCalendar />
        </div>
        <div className="w-full flex-1 overflow-x-auto border-gray-300 px-6">
          <CalendarTable />
        </div>
      </div>
    </Layout>
  );
}
