import Sidebar from "../components/sidebar"
import React, { useEffect, useState } from "react";
import { database, auth, app } from '../firebase.config';
import {
  getDatabase,
  ref,
  get, set,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  onValue,
  update,
  push,
  remove,
} from "firebase/database";
import { UserRoundX } from 'lucide-react';
import '../components/settings.css'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';




function Settings(){
    const db = getDatabase(app);
    const [visitorCount, setVisitorCount] = React.useState("--")
    const [monthlyVisitorCount, setMonthlyVisitorCount] = React.useState("--");

    useEffect(() => {
        const fetchData = () => {
          try {
            // Fetch daily_queue_number_counter with onValue for real-time updates
            const dailyRef = ref(database, "daily_queue_number_counter");
            const dailyUnsubscribe = onValue(dailyRef, (snapshot) => {
              if (snapshot.exists()) {
                setVisitorCount(snapshot.val());
              } else {
                console.error("No daily data available");
              }
            });
      
            // Fetch monthly_queue_number_counter with onValue for real-time updates
            const monthlyRef = ref(database, "monthly_queue_number_counter");
            const monthlyUnsubscribe = onValue(monthlyRef, (snapshot) => {
              if (snapshot.exists()) {
                setMonthlyVisitorCount(snapshot.val());
              } else {
                console.error("No monthly data available");
              }
            });
      
            // Cleanup function to unsubscribe from listeners
            return () => {
              dailyUnsubscribe();
              monthlyUnsubscribe();
            };
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, []);

    //code sa pagreset ng daily queue record
  const today = new Date().toISOString().split("T")[0];

  const handleResetDaily = async () => {
    try {
      const dailyRef = ref(database, "daily_queue_number_counter");
      const completedQueuesRef = ref(database, "CompletedQueues");
      const dailyRecordRef = ref(database, `DailyQueueRecord/${today}`);

      const resetDaily = await Swal.fire({
        title: 'Reset Daily Queue Number Counter?',
        text: 'Current Queue Number Counter will be saved to Daily Queue Record.',
        icon: '',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        customClass:{
          confirmButton: "confirm-button",
          cancelButton: "cancel-button"
        }
      })
      if(!resetDaily.isConfirmed){
      return;
      }
  
      // 1. Get the current daily_queue_number_counter value
      const dailySnapshot = await get(dailyRef);
      const dailyQueueNumberCounter = dailySnapshot.exists()
        ? dailySnapshot.val()
        : 0;
  
      // 2. Fetch CompletedQueues data for today
      const completedSnapshot = await get(completedQueuesRef);
  
      let totalCompleted = 0;
      let totalCancelled = 0;
  
      if (completedSnapshot.exists()) {
        const queues = completedSnapshot.val();
        Object.values(queues).forEach((queue) => {
          // Parse the date from Date_and_Time_Submitted
          const queueDate = new Date(queue.Date_and_Time_Submitted).toISOString().split("T")[0];
          if (queueDate === today) {
            if (queue.Status === "Completed") {
              totalCompleted++;
            } else if (queue.Status === "Cancelled") {
              totalCancelled++;
            }
          }
        });
      }

      
  
      // 3. Create the DailyQueueRecord entry
      await set(dailyRecordRef, {
        TotalCompleted: totalCompleted,
        TotalCancelled: totalCancelled,
        TotalQueues: dailyQueueNumberCounter,
      });
  
      // 4. Reset daily_queue_number_counter to 0
      await set(dailyRef, 0);
  
      toast("Daily Queue Record has been retrieved and counter has been reset successfully!");
    } catch (error) {
      console.error("Error resetting daily queue:", error);
       toast("Failed to reset daily queue. Please try again.");
    }
  };

 

   //code sa pagreset ng monthly queue record
  const handleResetMonthly = async () => {
    const dbRef = ref(database); // Reference to the database root
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" }); // e.g., "January"
    const currentYear = currentDate.getFullYear();
    const monthId = `${currentMonth}-${currentYear}`; // e.g., "January-2025"
  
    try {
      // Step 1: Retrieve the current value of monthly_queue_number_counter
      const counterRef = ref(database, "monthly_queue_number_counter");
      const counterSnapshot = await get(counterRef);
  
      if (counterSnapshot.exists()) {
        const counterValue = counterSnapshot.val(); // Get the counter value
        
        const confirmReset = await Swal.fire({
          title: 'Reset Monthly Queue Number Counter? ',
          text: 'Current Queue Number Counter will be saved to Monthly Queue Record.',
          icon: '',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          customClass:{
            confirmButton: "confirm-button",
            cancelButton: "cancel-button"
          }
        })
         if (!confirmReset.isConfirmed){
            return;
         }
  
        // Step 2: Create the MonthlyQueueRecord table
        const monthlyQueueRef = ref(database, `MonthlyQueueRecord/${monthId}`);
        await set(monthlyQueueRef, {
          TotalQueueRecord: counterValue, // Store the counter value
        });
  
        console.log(`Monthly queue record created for ${monthId}`);
    
        // Step 3: Reset monthly_queue_number_counter to 0
        await set(counterRef, 0);
        alert("Monthly Queue Record has been retrieved and counter has been reset successfully!");
        console.log("Monthly queue number counter reset to 0");
      } else {
        console.error("monthly_queue_number_counter does not exist.");
      }
    } catch (error) {
      console.error("Error resetting monthly queue record:", error);
    }
  };

  const [window1Status, setWindow1Status] = useState("Active");
  const [window2Status, setWindow2Status] = useState("Active");
  const [window3Status, setWindow3Status] = useState("Active");
  const [window1LogStat, setWindow1LogStat] = useState("Active");
  const [window2LogStat, setWindow2LogStat] = useState("Active");
  const [window3LogStat, setWindow3LogStat] = useState("Active");
  const [systemStatus, setSystemStatus] = useState("Active");
  const [cutoffStatus, setCutoffStatus] = useState("Active");

  // Fetch the initial status of the system
  useEffect(() => {
    const systemRef = ref(db, "QueueSystemStatus/Status");
    onValue(systemRef, (snapshot) => {
      const status = snapshot.val();
      setSystemStatus(status);
    });
  }, [db]);

  // Fetch the initial status of Window1
  useEffect(() => {
    const window1Ref = ref(db, "QueueSystemStatus/Window1/Status");
    onValue(window1Ref, (snapshot) => {
      const status = snapshot.val();
      setWindow1Status(status);
    });
  }, [db]);

  // Fetch the initial status of Window2
  useEffect(() => {
    const window2Ref = ref(db, "QueueSystemStatus/Window2/Status");
    onValue(window2Ref, (snapshot) => {
      const status = snapshot.val();
      setWindow2Status(status);
    });
  }, [db]);

  // Fetch the initial status of Window3
  useEffect(() => {
    const window3Ref = ref(db, "QueueSystemStatus/Window3/Status");
    onValue(window3Ref, (snapshot) => {
      const status = snapshot.val();
      setWindow3Status(status);
    });
  }, [db]);

    // Fetch the initial Login status of Window 1
  useEffect(() => {
    const window1Stat = ref(db, "QueueSystemStatus/Window1/LoginStatus");
    onValue(window1Stat, (snapshot) => {
      const LogStatus = snapshot.val();
      setWindow1LogStat(LogStatus);
    });
  }, [db]);

      // Fetch the initial Login status of Window 2
      useEffect(() => {
        const window2Stat = ref(db, "QueueSystemStatus/Window2/LoginStatus");
        onValue(window2Stat, (snapshot) => {
          const LogStatus = snapshot.val();
          setWindow2LogStat(LogStatus);
        });
      }, [db]);

   
  useEffect(() => {
    const window3Stat = ref(db, "QueueSystemStatus/Window3/LoginStatus");
    onValue(window3Stat, (snapshot) => {
      const LogStatus = snapshot.val();
      setWindow3LogStat(LogStatus);
    });
  }, [db]);

const handleLogStatus = async (windowName, currentLogStat) => {
  const isInactive = currentLogStat === "Inactive";
  const confirmMsg = await Swal.fire({
    title: 'Confirmation',
    text: ` Are you sure you want to set Login Status of ${windowName} to Unoccupied?`,
    icon: '',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    customClass:{
      confirmButton: "confirm-button",
      cancelButton: "cancel-button"
    }
  })
  if (confirmAction.isConfirmed) {

    const windowLogRef = ref(db, `QueueSystemStatus/${windowName}`);

update(windowLogRef, {LoginStatus: "Inactive"})
.then(() => {
  alert(`${windowName} has been set to unoccupied`);
  
}
)
  }

}

 
  const handleToggleStatus = async (windowName, currentStatus, setStatus) => {
    const isDisabling = currentStatus === "Active";
    const confirmMessage = isDisabling
      ? `Are you sure you want to disable ${windowName}?`
      : `Do you want to enable ${windowName}?`;
    const confirmAction = await Swal.fire({
      title: 'Confirmation',
      text: confirmMessage,
      icon: '',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      customClass:{
        confirmButton: "confirm-button",
        cancelButton: "cancel-button"
      }
    })
    if (confirmAction.isConfirmed) {
      const windowRef = ref(db, `QueueSystemStatus/${windowName}`);
      const newStatus = isDisabling ? "Inactive" : "Active";
  
      update(windowRef, { Status: newStatus })
        .then(() => {
          toast(`${windowName} has been ${newStatus === "Inactive" ? "disabled" : "enabled"}.`);
          setStatus(newStatus);
        })
        .catch((error) => {
          console.error(`Error updating ${windowName} status:`, error);
          toast(`Failed to update ${windowName} status. Please try again.`);
        });
    }
  };

  const handleToggleCutOffStatus = async () => {
    const isCuttoff = cutoffStatus === "Active";
    const confirmMessage = isCuttoff
      ?  "Cut off time is lifted after confirmation"
      : "Cut off time will set.";
    const confirmTitle = isCuttoff
       ? "Disable Cut off?"
       : "Cut off"
     const confirmAction = await Swal.fire({
      title: confirmTitle,
      text: confirmMessage,
      icon: '',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      customClass:{
        confirmButton: "confirm-button",
        cancelButton: "cancel-button"
      }
    })
  
    if (confirmAction.isConfirmed) {
      const systemRef = ref(db, "QueueSystemStatus/CutOffStatus");
      const newStatus = isCuttoff? "Inactive" : "Active";
  
      set(systemRef, newStatus)
        .then(() => {
          toast(`Cutoff ${newStatus === "Inactive" ? "disabled" : "enabled"}.`);
          setCutoffStatus(newStatus);
        })
        .catch((error) => {
          console.error("Error updating system status:", error);
          toast.warn("Failed to update system status. Please try again.");
        });
    }
  };

  const handleToggleSystemStatus = async () => {
    const isDisabling = systemStatus === "Active";
    const confirmMessage = isDisabling
      ? "This will shut down the whole finance system."
      : "System operations will continue after confirmation";
    const confirmTitle = isDisabling
       ? "Are you sure you want to disable the entire system?"
       : "Do you want to enable the system again?"
     const confirmAction = await Swal.fire({
      title: confirmTitle,
      text: confirmMessage,
      icon: '',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      customClass:{
        confirmButton: "confirm-button",
        cancelButton: "cancel-button"
      }
    })
  
    if (confirmAction.isConfirmed) {
      const systemRef = ref(db, "QueueSystemStatus/Status");
      const newStatus = isDisabling ? "Inactive" : "Active";
  
      set(systemRef, newStatus)
        .then(() => {
          toast(`The system has been ${newStatus === "Inactive" ? "disabled" : "enabled"}.`);
          setSystemStatus(newStatus);
        })
        .catch((error) => {
          console.error("Error updating system status:", error);
          toast.warn("Failed to update system status. Please try again.");
        });
    }
  };
  

    return(
     <>
     <Sidebar />
      <div className="Swin-container">
        <div className="settings-headCont">
          <div className="name">
            <h4 className="settings-header">Settings</h4>
          </div>
        </div>
        <hr />

        <div className="Fin-section">Finance Window</div>
        <div className="settings-container">
          <div className="finCard-wrapper">

  <div className="fin1-wrapper">
 <div className="fin-card1" style={{ backgroundColor: window1Status === "Active" ? "#5366C8" : "#ffcccb" }}>
  <h2 className="finCard-title">Finance Window 1</h2>
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    

<div className={`finCard-toggle ${window1Status === 'Active' ? 'active' : 'inactive'}`}
        onClick={() => handleToggleStatus("Window1", window1Status, setWindow1Status)}>
    <div className="finCard-circle"
      style={{
        left: window1Status === "Active" ? "32px" : "2px",
      }}/>

      </div>
    </div>
</div>

<div className="status-cont">
  <h2 className="finCard-status">Status:</h2>
  <button className="disable"
  style={{ backgroundColor: window1LogStat === "Active" ? "#5366C8" : "green",
    color: "white", cursor: window1LogStat === "Inactive" ? "not-allowed" : "pointer",
    opacity: window1LogStat === "Inactive" ? 0.6 : 1,}}
  onClick={() => handleLogStatus("Window1", window1LogStat, setWindow1LogStat)}
  disabled={window1LogStat === "Inactive"}>
  {window1LogStat === "Active" ? "Occupied" : "Unoccupied"}
</button>
</div>

</div>
<div className="fin1-wrapper">
<div className="fin-card1"
  style={{
    backgroundColor: window2Status === "Active" ? "#5366C8" : "#ffcccb"
  }}>
  <h2 className="finCard-title">Finance Window 2</h2>
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <div className={`finCard-toggle ${window2Status === 'Active' ? 'active' : 'inactive'}`}
        onClick={() => handleToggleStatus("Window2", window2Status, setWindow2Status)}>
    <div
      style={{
        width: "25px",
        height: "25px",
        backgroundColor: "white",
        borderRadius: "50%",
        position: "absolute",
        left: window2Status === "Active" ? "32px" : "2px",
        transition: "left 0.3s ease",
      }}
    ></div>
    </div>
    </div>
</div>

<div className="status-cont">
  <h2 className="finCard-status">Status:</h2>
  <button
  className="disable"
  style={{
    backgroundColor: window2LogStat === "Active" ? "red" : "green",
    color: "white",
    cursor: window2LogStat === "Inactive" ? "not-allowed" : "pointer",
    opacity: window2LogStat === "Inactive" ? 0.6 : 1,
  }}
  onClick={() => handleLogStatus("Window2", window2LogStat, setWindow2LogStat)}
  disabled={window2LogStat === "Inactive"}
>
  {window2LogStat === "Active" ? "Occupied" : "Unoccupied"}
</button>
</div>
</div>

<div className="fin1-wrapper">
<div className="fin-card1"
  style={{
    backgroundColor: window3Status === "Active" ? "#5366C8" : "#ffcccb"
  }}>
  <h2 className="finCard-title">Finance Window 3</h2>
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <div className={`finCard-toggle ${window3Status === 'Active' ? 'active' : 'inactive'}`}
        onClick={() => handleToggleStatus("Window3", window3Status, setWindow3Status)}>
    <div
      style={{
        width: "25px",
        height: "25px",
        backgroundColor: "white",
        borderRadius: "50%",
        position: "absolute",
        left: window3Status === "Active" ? "32px" : "2px",
        transition: "left 0.3s ease",
      }}
    ></div>
    </div>
    </div>
   
</div>

<div className="status-cont">
  <h2 className="finCard-status">Status:</h2>
  <button className="disable"
  style={{
    backgroundColor: window3LogStat === "Active" ? "red" : "green",
    color: "white",
    cursor: window3LogStat === "Inactive" ? "not-allowed" : "pointer",
    opacity: window3LogStat === "Inactive" ? 0.6 : 1,
  }}
  onClick={() => handleLogStatus("Window3", window3LogStat, setWindow3LogStat)}
  disabled={window3LogStat === "Inactive"}
>
  {window3LogStat === "Active" ? "Occupied" : "Unoccupied"}
</button>
  </div>
  </div>

    </div>

    <div className="Fin-section">Dashboard</div>

    <div className="dashCard-wrapper">

       <div className="dash-card1">
         <h3 className="Svisit-header">Visitors Today</h3>
         <h1 className="Svisitor-count">{visitorCount}</h1>
         <div className="buttown">
          <button className="btnResetDaily" onClick={handleResetDaily}>
           Reset
          </button>
         </div>
       </div>
        

        <div className="dash-card1">
           <h3 className="Svisit-header">This Month</h3>
           <h1 className="Smos-visitor">{monthlyVisitorCount}</h1>
           <div className="buttown">
            <button className="btnResetMonthly" onClick={handleResetMonthly}>
            Reset
            </button>
           </div>
        </div>
          
        </div>

        <div className="Fin-section">System</div>

        <div className="system-wrapper">

            <div className="system-card">

              <div className="CutOff-wrapper">
              <h5 className="tittle"> Cut-off Time </h5>
              <p className="tit-descrip">
                 Getting queues will be disabled when it reaches cut-off time.
              </p>
              </div>

            <div className="CutOffBtn-container">
            <button className={`cutoff-btn ${cutoffStatus === "Active" ? "Disable" : "Enable"}`}
            onClick={handleToggleCutOffStatus}> {cutoffStatus=== "Active" ? "Disable" : "Enable"}
            </button>
            </div>
            </div>
  
            
            <div className="system-card">

              <div className="shutdown-wrapper">
              <h5 className="tittle"> Shut off System </h5>
              <p className="tit-descrip">
                This will affect all the finance queues and records. Please ensure that
                this must <br /> be done during break times and after working hours.
              </p>
              </div>

            <div className="shutBtn-container">
            <button className={`shutoff-btn ${systemStatus === "Active" ? "Disable" : "Enable"}`} onClick={handleToggleSystemStatus}>
              {systemStatus === "Active" ? "Disable" : "Enable"}
            </button>
            </div>
            </div>
    </div>
    
         <ToastContainer position="top-center"/>
    </div>
  </div>
     </>
    )
}

export default Settings