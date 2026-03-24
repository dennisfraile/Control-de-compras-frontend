import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import WelcomeWizard from '../onboarding/WelcomeWizard';
import PageTransition from '../common/PageTransition';

export default function AppLayout() {
  const location = useLocation();

  return (
    <Layout>
      <WelcomeWizard />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </Layout>
  );
}
