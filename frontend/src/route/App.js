import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import PreviewPage from '../pages/PreviewPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
