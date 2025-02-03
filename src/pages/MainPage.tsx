import { CalendarTable } from '../components/Calendar/CalendarTable/CalendarTable';
import SideCalendar from '../components/Calendar/SideCalendar/SideCalendar';
import Layout from '../components/Layout/Layout';
import { useAuthStore } from '../zustand/useAuthStore';

export default function MainPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row">
        <div className="flex justify-center w-full pl-4 mb-4 lg:block lg:max-w-xs lg:justify-center">
          <SideCalendar />
        </div>
        <div className="flex-1 w-full px-6 overflow-x-auto border-gray-300">
          <CalendarTable isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </Layout>
  );
}
