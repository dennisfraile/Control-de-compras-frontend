import { Outlet } from 'react-router-dom';
import Layout from './Layout';
import WelcomeWizard from '../onboarding/WelcomeWizard';

export default function AppLayout() {
  return (
    <Layout>
      <WelcomeWizard />
      <Outlet />
    </Layout>
  );
}
