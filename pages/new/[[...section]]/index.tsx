import { APageBox } from 'src/components/astra/astra-page-box';
import { DashboardAll } from 'src/components/astra/dashboard/dashboard-all';

const DashboardPage = () => {
  return (
    <APageBox title="Collection" showTitle={false}>
      <DashboardAll />
    </APageBox>
  );
};

export default DashboardPage;
