import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { database } from '../firebase.config';
import { ref, onValue } from 'firebase/database';

function Wins() {
  const navigate = useNavigate();
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  const handleAdminClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer); // Reset the timer on every click
    }

    const newClickCount = adminClickCount + 1;
    setAdminClickCount(newClickCount);

    if (newClickCount === 5) {
      navigate('/login'); // Redirect to the Login page
      resetClickCount(); // Reset the count after redirection
    } else {
      // Set a new timer to reset the count if 3 seconds pass without 5 clicks
      setClickTimer(
        setTimeout(() => {
          resetClickCount();
        }, 3000) // 3 seconds
      );
    }
  };

  // Reset the click count and timer
  const resetClickCount = () => {
    setAdminClickCount(0);
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    setClickTimer(null);
  };

  // Clean up the timer on component unmount
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);


  const [loginStatus, setLoginStatus] = useState({
    'Window 1': 'Inactive',
    'Window 2': 'Inactive',
    'Window 3': 'Inactive',
  });

  // Fetch login statuses from Firebase
  useEffect(() => {
    const statusRef = ref(database, 'QueueSystemStatus');
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLoginStatus({
          'Window 1': data.Window1.LoginStatus,
          'Window 2': data.Window2.LoginStatus,
          'Window 3': data.Window3.LoginStatus,
        });
      }
    });
  }, []);

  // Handle window selection
  const handleWindowSelection = (window) => {
    if (loginStatus[window] === 'Inactive') {
      const routes = {
        'Window 1': '/log1',
        'Window 2': '/log2',
        'Window 3': '/log3',
      };
      navigate(routes[window], { state: { selectedWindow: window } });
    }
  };

  return (
    <div className="cont">
    <div className="header">
      {/* Admin text */}
      <div className="head-logo" onClick={handleAdminClick}
        style={{ cursor: 'default', userSelect: 'none' }} // Makes it look unclickable
      >
        EasyQ's-<span style={{ textDecoration: '' }}>Admin</span>
      </div>
      <div className="head-win">Finance Window</div>
    </div>

      <div className="button-wrapper">
        {['Window 1', 'Window 2', 'Window 3'].map((window, index) => (
          <button
            key={index}
            className={`btn-${index + 1}`}
            onClick={() => handleWindowSelection(window)}
            disabled={loginStatus[window] === 'Active'}
            style={{
              backgroundColor: loginStatus[window] === 'Active' ? 'gray' : '',
              cursor: loginStatus[window] === 'Active' ? 'not-allowed' : 'pointer',
            }}
          >
            {loginStatus[window] === 'Active' ? 'Occupied' : window}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Wins;
