import React from 'react';
import { DashboardContainer } from './containers/DashboardContainer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
      <DashboardContainer />
    </div>
  );
};

export default App;
