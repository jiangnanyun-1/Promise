import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './pages/Dashboard';
import './styles/theme.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <header className="app-header">
          <div className="app-header-inner">
            <h1 className="app-title">企业销售数据分析平台</h1>
          </div>
        </header>
        <main className="app-main">
          <Dashboard />
        </main>
      </div>
    </Provider>
  );
}

export default App;
