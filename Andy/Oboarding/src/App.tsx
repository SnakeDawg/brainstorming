// React import not needed with react-jsx transform
import { SetupProvider, useSetup } from './contexts/SetupContext';
import WelcomeScreen from './components/welcome/WelcomeScreen';
import NameInputScreen from './components/interview/NameInputScreen';
import ChatInterface from './components/interview/ChatInterface';
import AnalyzingScreen from './components/interview/AnalyzingScreen';
import PersonaDetection from './components/persona/PersonaDetection';
import PersonaConfirmation from './components/persona/PersonaConfirmation';
import AppRecommendations from './components/persona/AppRecommendations';
import DeviceDetectionScreen from './components/setup/DeviceDetectionScreen';
import DisplayArrangementScreen from './components/setup/DisplayArrangementScreen';
import DisplayCalibrationScreen from './components/setup/DisplayCalibrationScreen';
import BluetoothPairingScreen from './components/setup/BluetoothPairingScreen';
import PeripheralSetupScreen from './components/setup/PeripheralSetupScreen';
import InstallationProgress from './components/progress/InstallationProgress';
import SetupComplete from './components/completion/SetupComplete';
import ActivityButton from './components/activity/ActivityButton';
import SetupProgressBar from './components/progress/SetupProgressBar';

function SetupFlow() {
  const { state } = useSetup();

  // Render appropriate component based on current phase
  const renderMainContent = () => {
    switch (state.currentPhase) {
      case 'welcome':
        return <WelcomeScreen />;

      case 'name-input':
        return <NameInputScreen />;

      case 'interview':
        return <ChatInterface />;

      case 'analyzing':
        return <AnalyzingScreen />;

      case 'persona-detection':
        return <PersonaDetection />;

      case 'persona-confirmation':
        return <PersonaConfirmation />;

      case 'app-recommendations':
        return <AppRecommendations />;

      case 'device-detection':
        return <DeviceDetectionScreen />;

      case 'display-arrangement':
        return <DisplayArrangementScreen />;

      case 'display-calibration':
        return <DisplayCalibrationScreen />;

      case 'bluetooth-pairing':
        return <BluetoothPairingScreen />;

      case 'peripheral-setup':
        return <PeripheralSetupScreen />;

      case 'installation':
        return <InstallationProgress />;

      case 'complete':
        return <SetupComplete />;

      default:
        return <WelcomeScreen />;
    }
  };

  const showProgressBar = !['welcome', 'privacy', 'name-input', 'complete'].includes(state.currentPhase);

  return (
    <>
      {/* Setup Progress Bar */}
      {showProgressBar && <SetupProgressBar />}

      {renderMainContent()}

      {/* Activity button available on all screens except welcome */}
      {state.currentPhase !== 'welcome' && <ActivityButton />}
    </>
  );
}

function App() {
  return (
    <SetupProvider>
      <SetupFlow />
    </SetupProvider>
  );
}

export default App;
