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

      const resetDaily = window.confirm('Are you sure you want to reset?')
      if(!resetDaily){
      return;
      }
  
      // 3. Create the DailyQueueRecord entry
      await set(dailyRecordRef, {
        TotalCompleted: totalCompleted,
        TotalCancelled: totalCancelled,
        TotalQueues: dailyQueueNumberCounter,
      });
  
      // 4. Reset daily_queue_number_counter to 0
      await set(dailyRef, 0);
  
      alert("Daily Queue Record has been retrieved and counter has been reset successfully!");
    } catch (error) {
      console.error("Error resetting daily queue:", error);
      alert("Failed to reset daily queue. Please try again.");
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
        
        const confirmReset = window.confirm(" Are you sure that you want to reset? This may affect current record ")
         if (!confirmReset){
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
  
    // Fetch the initial status of Window1
    useEffect(() => {
      const window1Ref = ref(db, "QueueSystemStatus/Window1/Status");
      onValue(window1Ref, (snapshot) => {
        const status = snapshot.val();
        setWindow1Status(status);
      });
    }, [db]);
  

   // Function to handle the button click
    const handleToggleStatus = () => {
      const isDisabling = window1Status === "Active";
      const confirmMessage = isDisabling
        ? "Are you sure you want to disable Window 1?"
        : "Do you want to enable Window 1?";
      const confirmAction = window.confirm(confirmMessage);
  
      if (confirmAction) {
        const window1Ref = ref(db, "QueueSystemStatus/Window1");
        const newStatus = isDisabling ? "Inactive" : "Active";
       
  
        update(window1Ref, { Status: newStatus })
          .then(() => {
            alert(`Window 1 has been ${newStatus === "Inactive" ? "disabled" : "enabled"}.`);
          })
          .catch((error) => {
            console.error("Error updating status:", error);
            alert(`Failed to update Window 1 status. Please try again.`);
          });
      }
    };
  

    return(
     <>
     <Sidebar/>
     <div className="Swin-container">

     <div className="settings-headCont">
        <div className="name">
          <h4 className="settings-header">Settings</h4>
        </div>
     </div>
     <hr/>

      <div className="Fin-section">Finance Window</div>
  <div className="settings-container">

    <div className="finCard-wrapper">

        <div className="fin-card1">
          <h2 className="finCard-title">Finance Window 1</h2>
          <button className="disable" onClick={handleToggleStatus}>
          {window1Status === "Active" ? "Disable" : "Enable"} </button>
        </div>

        <div className="fin-card1">
          <h2 className="finCard-title">Finance Window 2</h2>
          <button className="disable" onClick={handleToggleStatus}>
          {window1Status === "Active" ? "Disable" : "Enable"} </button>
        </div>

        <div className="fin-card1">
          <h2 className="finCard-title">Finance Window 3</h2>
          <button className="disable" onClick={handleToggleStatus}>
          {window1Status === "Active" ? "Disable" : "Enable"} </button>
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
             <h5 className="tittle"> Shut off System </h5>
             <p className="tit-descrip">This will affect all the finance queues and records. Please ensure that this must <br/> be done during break times and after working hours </p>
           </div>
           <button className="shutoff-btn">Disable</button>
        </div>
        
    </div>
  </div>
     </>
    )
}

export default Settings