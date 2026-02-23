import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HRProvider } from './context/HRContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Candidates } from './pages/Candidates';
import { AIAssistant } from './pages/AIAssistant';
import { VoiceInterview } from './pages/VoiceInterview';

function App() {
  return (
    <HRProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="interview" element={<VoiceInterview />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HRProvider>
  );
}

export default App;
