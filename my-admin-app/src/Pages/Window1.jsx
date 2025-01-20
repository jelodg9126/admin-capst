import Sidebar from "../components/sidebar";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  onValue,
  update,
  push,
  remove,
} from "firebase/database";

function Window1() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC1-rPcvqin2WWSAA96N5Gp2L1538PCuJ8",
    authDomain: "easyq-s.firebaseapp.com",
    databaseURL: "https://easyq-s-default-rtdb.firebaseio.com",
    projectId: "easyq-s",
    storageBucket: "easyq-s.firebasestorage.app",
    messagingSenderId: "485410986210",
    appId: "1:485410986210:web:aa2dab9b4e00917212a6bb",
    measurementId: "G-VC0BZM9ERT",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // State management
  const [currentQueue, setCurrentQueue] = useState(null);
  const [currentQueueId, setCurrentQueueId] = useState(null);

  // Fetch the next queue when component mounts
   useEffect(() => {
     fetchNextQueue();
    console.log("rendering")
   }, []);

  // Fetch next queue
  const fetchNextQueue = () => {
    setCurrentQueue(null); // Clear current queue data
    const nextQueueQuery = query(
      ref(db, "queues"),
      orderByChild("Status"),
      equalTo("Pending"),
      limitToFirst(1)
    );

    onValue(
      nextQueueQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const firstEntryKey = Object.keys(data)[0];
          setCurrentQueueId(firstEntryKey);

          const queueRef = ref(db, `queues/${firstEntryKey}`);
          const startTime = new Date().toISOString(); // Using ISO format for StartTime

          update(queueRef, { Status: "Processing", StartTime: startTime, Window_Received: "Window1"  })
            .then(() => {
              setCurrentQueue(data[firstEntryKey]);
            })
            .catch((error) => {
              console.error("Error updating queue status:", error);
            });
        } else {
          alert("No more pending queues!");
        }
      },
      { onlyOnce: true }
    );
  };

  // Complete current queue
  const completeCurrentQueue = () => {
    if (currentQueueId && confirm("Are you sure you want to proceed to the next queue?")) {
      const currentQueueRef = ref(db, `queues/${currentQueueId}`);
      onValue(
        currentQueueRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const currentData = snapshot.val();
            const endTime = new Date().toISOString().replace('T', ' ').split('.')[0]; // Date Format
            const startTimeMillis = Date.parse(currentData.StartTime); // Parse StartTime as timestamp
            const endTimeMillis = Date.now(); // Current time in milliseconds
            const processingTimeMillis = endTimeMillis - startTimeMillis;

            // Debugging logs
            console.log("StartTime:", currentData.StartTime);
            console.log("Parsed StartTime (ms):", startTimeMillis);
            console.log("EndTime:", endTime);
            console.log("Processing Time (ms):", processingTimeMillis);

            if (isNaN(startTimeMillis) || isNaN(processingTimeMillis)) {
              console.error("Invalid time data for processing time calculation.");
              alert("Cannot calculate processing time. StartTime is missing or invalid.");
              return;
            }

            const readableProcessingTime = formatProcessingTime(processingTimeMillis);

            push(ref(db, "CompletedQueues"), {
              ...currentData,
              Status: "Completed",
              Date_and_Time_Completed: endTime,
              ProcessingTime: readableProcessingTime,
            }).then(() => {
              remove(ref(db, `queues/${currentQueueId}`)).then(() => {
                fetchNextQueue();
              });
            });
          }
        },
        { onlyOnce: true }
      );
    }
  };

  // Cancel current queue
  const cancelCurrentQueue = () => {
    if (currentQueueId && confirm("Are you sure you want to cancel this queue?")) {
      const reason = prompt("Please enter the reason for cancellation:");
      if (reason) {
        const currentQueueRef = ref(db, `queues/${currentQueueId}`);
        const endTime = new Date().toISOString(); // Using ISO format for CompletedTime
  
        onValue(
          currentQueueRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const currentData = snapshot.val();
              const startTimeMillis = Date.parse(currentData.StartTime); // Parse StartTime as timestamp
              const endTimeMillis = Date.now(); // Current time in milliseconds
              const processingTimeMillis = endTimeMillis - startTimeMillis;
  
              let readableProcessingTime = "N/A"; // Default value
              if (!isNaN(startTimeMillis) && !isNaN(processingTimeMillis)) {
                readableProcessingTime = formatProcessingTime(processingTimeMillis);
              }
  
              push(ref(db, "CompletedQueues"), {
                ...currentData,
                Status: "Cancelled",
                CancelReason: reason,
                CompletedTime: endTime,
                ProcessingTime: readableProcessingTime, // Record calculated processing time
              }).then(() => {
                remove(ref(db, `queues/${currentQueueId}`)).then(() => {
                  setCurrentQueue(null); // Clear the current queue
                  fetchNextQueue(); // Fetch the next queue
                });
              });
            }
          },
          { onlyOnce: true }
        );
      } else {
        alert("Cancellation reason is required.");
      }
    }
  };
  

  // Format processing time
  const formatProcessingTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    const formattedTime = [];
    if (hours > 0) formattedTime.push(`${hours} hours`);
    if (minutes > 0) formattedTime.push(`${minutes} minutes`);
    formattedTime.push(`${seconds} seconds`);

    return formattedTime.join(", ");
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

  return (
    <>
      <Sidebar />
    <div className="win1-container">
        <div className="win-headz">
          <h2 className="win-title">FINANCE WINDOW 1</h2>
          <button className="disable" onClick={handleToggleStatus}>
        {window1Status === "Active" ? "Disable" : "Enable"}
      </button>
        </div>

       <hr/>
       
          <div className="user-container">
            <div className="userInfo-card">
              <h3 className="uid">User ID: {currentQueue?.UserID || "N/A"}</h3>
              <h3 className="name">Name: {currentQueue?.Name || "N/A"}</h3>
              <h3 className="email">Email: {currentQueue?.Email || "N/A"}</h3>
              <h3 className="contact">Contact No: {currentQueue?.ContactNumber || "N/A"}</h3>
              <h3 className="purpose">Purpose: {currentQueue?.Queue_Purpose || "N/A"}</h3>
            </div>
          </div>
          
      <div className="queue-container">
        <div className="q-wrapper">
          <div className="queue-card">
            <h2 className="current-queue">Current Queue:</h2>
             <h2 className="q-num">  {currentQueue?.Queue_Number || "N/A"}</h2>
          </div>
        </div>

          <div className="qBtn-container">
            <button className="cancel" onClick={cancelCurrentQueue}>Cancel</button>
            <button className="recall">Recall</button>
            <button className="next" onClick={completeCurrentQueue}>Next Queue</button>
          </div>         
        </div>

    </div> 
 
    </>
  );
}

export default Window1;
