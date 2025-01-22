import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Window1 from './Pages/Window1';
import LogAdmin1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/LoginAd1';
import Dashboard1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/Dashboard1';
import WindowAd1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/WindowAd1';
import LogAdmin2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/LoginAd2';
import Dashboard2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/Dashboard2';
import WindowAd2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/WindowAd2';
import LogAdmin3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/LoginAd3';
import Dashboard3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/Dashboard3';
import WindowAd3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/WindowAd3';
import Users from './Pages/Users';
import AddAccount from './Pages/AddAccount';
import Wins from './Pages/Wins';
import PendingQueues from './Pages/PendingQueues';
import LogHis from './Pages/LogHis';
import { database } from './firebase.config'; 
import Login from './Pages/Login';






function App() {
  return (
    <>
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/dashboard3" element={<Dashboard3 />} />
        <Route path="/log1" element={<LogAdmin1 />} />
        <Route path="/log2" element={<LogAdmin2 />} />
        <Route path="/log3" element={<LogAdmin3 />} /> 
        <Route path="/logHis" element={<LogHis database={database} />} />
        <Route path="/win1" element={<Window1/>} />
        <Route path="/winad1" element={<WindowAd1/>} />
        <Route path="/winad2" element={<WindowAd2/>} />
        <Route path="/winad3" element={<WindowAd3/>} />
        <Route path="/users" element={<Users />} />
        <Route path="/acc" element={<AddAccount />} />
        <Route path="/win" element={<Wins/>} />
        <Route path="/pqs" element={<PendingQueues/>} />

      </Routes>
    </div>
    </>
  );
}

export default App;
