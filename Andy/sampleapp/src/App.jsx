import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PersonalAssistant from './pages/PersonalAssistantNew';
import AppMarketplace from './pages/AppMarketplace';
import SystemOptimization from './pages/SystemOptimization';
import Security from './pages/Security';
import DeviceUpdates from './pages/DeviceUpdates';
import Support from './pages/Support';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<PersonalAssistant />} />
            <Route path="/marketplace" element={<AppMarketplace />} />
            <Route path="/system-optimization" element={<SystemOptimization />} />
            <Route path="/security" element={<Security />} />
            <Route path="/device-updates" element={<DeviceUpdates />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
