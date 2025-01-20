import { useNavigate } from 'react-router-dom';

function Wins() {
  const navigate = useNavigate();

  // Generalized method to handle window selection
  const handleWindowSelection = (window) => {
    const routes = {
      'Window 1': '/log1',
      'Window 2': '/log2',
      'Window 3': '/log3',
    };

    const route = routes[window];
    if (route) {
      navigate(route, { state: { selectedWindow: window } });
    } else {
      console.error('Unknown window selected');
    }
  };

  return (
    <div className="cont">
      <div className="header">
        <div className="head-logo">SmartQueues-Admin</div>
        <div className="head-win">Finance Window</div>
      </div>

      <div className="button-wrapper">
        {/* Button for each window */}
        <button className="btn-1" onClick={() => handleWindowSelection('Window 1')}>
          Window 1
        </button>
        <button className="btn-2" onClick={() => handleWindowSelection('Window 2')}>
          Window 2
        </button>
        <button className="btn-3" onClick={() => handleWindowSelection('Window 3')}>
          Window 3
        </button>
      </div>
    </div>
  );
}

export default Wins;
