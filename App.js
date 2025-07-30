import React, { useState } from 'react';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';

function App() {
  const [view, setView] = useState('login'); // 'login' o 'register'

  return (
    <div className="App">
      {view === 'login' && <Login onChangeView={setView} />}
      {view === 'register' && <Register onChangeView={setView} />}
    </div>
  );
}

export default App;
