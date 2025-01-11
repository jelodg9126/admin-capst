import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Wins() {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <>
      <div className="cont">
        <div className="header">
          <div className="head-logo">SmartQueues-Admin</div>
          <div className="head-win">Finance Window</div>
        </div>

        <div className="button-wrapper">
          <button className="btn-1" onClick={() => navigate('/log1')}> 
            Window 1
          </button>
          <button className="btn-1" onClick={() => navigate('/log2')}> 
            Window 2
          </button>
          <button className="btn-3">Window 3</button>
        </div>
      </div>
    </>
  );
}

export default Wins;
