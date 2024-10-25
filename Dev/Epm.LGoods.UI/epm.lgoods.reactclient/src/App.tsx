import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';


const App: React.FC = () => {
  return (
   <>
  <Router >
    <AppRoutes/>
  </Router>
   </>
  );
};

export default App;
