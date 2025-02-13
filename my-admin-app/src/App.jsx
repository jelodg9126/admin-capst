import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Admin  from  './Pages/Admin';
import LogAdmin1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/LoginAd1';
import Dashboard1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/Dashboard1';
import WindowAd1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/WindowAd1';
import LogAdmin2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/LoginAd2';
import Dashboard2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/Dashboard2';
import WindowAd2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/WindowAd2';
import LogAdmin3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/LoginAd3';
import Dashboard3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/Dashboard3';
import WindowAd3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/WindowAd3';
import Users1 from '../../../Win1/admin-capst/my-admin-app/src/Pages/Users1';
import Users2 from '../../../Win2/admin-capst/my-admin-app/src/Pages/Users2';
import Users3 from '../../../Win3/admin-capst/my-admin-app/src/Pages/Users3';
import Users from './Pages/Users';
import AddAccount from './Pages/AddAccount';
import Wins from './Pages/Wins';
import PendingQueues from './Pages/PendingQueues';
import LogHis from './Pages/LogHis';
import { database } from './firebase.config'; 
import Login from './Pages/Login';
import Settings from './Pages/Settings';
import Feedback from './Pages/Feedback';






function App() {
  return (
    <>
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Wins/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/dashboard3" element={<Dashboard3 />} />
        <Route path="/log1" element={<LogAdmin1 />} />
        <Route path="/log2" element={<LogAdmin2 />} />
        <Route path="/log3" element={<LogAdmin3 />} />  
        <Route path="/logHis" element={<LogHis database={database} />} />
        <Route path="/winad1" element={<WindowAd1/>} />
        <Route path="/winad2" element={<WindowAd2/>} />
        <Route path="/winad3" element={<WindowAd3/>} /> 
        <Route path="/users" element={<Users />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/users1" element={<Users1 />} />
        <Route path="/users2" element={<Users2 />} />
        <Route path="/users3" element={<Users3 />} />
        <Route path="/acc" element={<AddAccount />} />
        <Route path="/wins" element={<Wins/>} />
        <Route path="/pqs" element={<PendingQueues/>} />
        <Route path="/fdbck" element={<Feedback/>} />
        <Route path="/sts" element={<Settings/>} />

      </Routes>
    </div>
    </>
  );
}

export default App;
