import { Chart as ChartJS, defaults } from "chart.js/auto"
import Sidebar from "../components/sidebar"
import { Bar } from "react-chartjs-2"
import sourceData from "../sourceData.json"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  Goal,
  ListOrdered,
  IdCard,
  ChartLine,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import tableData from "../tableData.json"
import { database } from '../firebase.config';
import { ref, get, child, set, query, orderByChild, equalTo, update, onValue } from "firebase/database";


const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("QueueID", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <ListOrdered className="mr-2" size={18} /> QueueID
      </span>
    ),
  }),
  columnHelper.accessor("UserID", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <IdCard className="mr-2" size={18} /> UserID
      </span>
    ),
  }),
  columnHelper.accessor("Name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> Name
      </span>
    ),
  }),
  columnHelper.accessor("Queue_Purpose", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center"> 
      <Goal className="mr-2" size={16} /> Purpose
      </span>
    ),
  }),
  columnHelper.accessor("Status", {
    header: () => (
      <span className="flex items-center">
        <ChartLine className="mr-2" size={16} /> Status 
         </span>
    ),
    cell: (info) => (
      <span className={`italic text-white p-2 px-3.5 rounded-3xl ${
        info.getValue() === "Completed" ? "bg-green-600" : "bg-red-600"
      }`}>
        {info.getValue()}
      </span>
    ),
  }),
];



//code sa bargraph
function BarChart({ database }) {
  const [sourceData, setSourceData] = useState([]);

  useEffect(() => {
    // Reference to the MonthlyQueueRecord table
    const dbRef = ref(database, "MonthlyQueueRecord");
    // Listen for real-time updates from the database
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const currentYear = new Date().getFullYear();
      const formattedData = months.map((month) => {
        const key = `${month}-${currentYear}`;
        const monthData = snapshot.val()?.[key];
        return {
          label: month,
          value: monthData ? monthData.TotalQueueRecord : "---",
        };
      });
      setSourceData(formattedData);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [database]);
  return (
    <div className="bar-card student-dept">
      <Bar
        data={{
          labels: sourceData.map((data) => data.label),
          datasets: [
            {
              label: "Number of Visitors",
              data: sourceData.map((data) =>
                data.value === "---" ? 0 : data.value
              ),
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Queue Records per Month",
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  sourceData[context.dataIndex].value === "---"
                    ? "No data available"
                    : `Number of Students: ${context.raw}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 20,
              },
            },
          },
        }}
      />
    </div>
  );
}


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";


function Dashboard(){

  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [visitorCount, setVisitorCount] = React.useState("--");
  const [monthlyVisitorCount, setMonthlyVisitorCount] = React.useState("--");
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-PH'));

  //code sa pagdisplay ng date
  const dbdate = new Date().toLocaleDateString('en-PH', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  //Clock displayeye
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-PH'));
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);




 

  //code sa pagdisplay ng daily at monthly visitors
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

  //code sa pagdisplay ng completed queues table
  React.useEffect(() => {
    const dbRef = ref(database, "CompletedQueues");
  
    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          const formattedData = Object.keys(firebaseData).map((id) => {
            const item = firebaseData[id];
            return {
              QueueID: id,
              UserID: item.UserID,
              Name: item.Name,
              Queue_Purpose: item.Queue_Purpose,
              Status: item.Status,
            };
          });
          setData(formattedData);
        } else {
          console.log("No data available");
          setData([]); // Clear the table if there's no data
        }
      } catch (error) {
        console.error("Error processing snapshot data: ", error);
      }
    });
  
    // Cleanup listener when the component unmounts
    return () => unsubscribe();
  }, []);

  //code sa pagination ng mga table
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination, // Use the pagination state here
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination, // Update pagination handler
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  

  console.log(table.getRowModel());
    return(
   <>
     <Sidebar/>
     <div className="d-container">
      <div className="d-heading">
        <div className="name">
         <h4>Welcome, Main Admin!</h4>
         <h5 className="dash-date">{dbdate}</h5>
         </div>
            <div className="time">{time}</div>
      </div>
       <hr/>
     <div className="d-content">
     <div className="topDiv-header">Analytics</div>
      <div className="topdiv">
     <div className="visit-wrapper">
      <div className="visit-card">
         <h3 className="visit-header">Visitors Today</h3>
         <h1 className="visitor-count">{visitorCount}</h1>

       </div>

       <div className="visit-card">
         <h3 className="visit-header">This Month</h3>
         <h1 className="mos-visitor">{monthlyVisitorCount}</h1>
        
      </div>
      </div>
      <BarChart database={database} />
      </div>
      </div>

      <div className="table-header"> Transaction History</div>
  
      <div className="flex flex-col min-h-full max-xl:-4xl py-3 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 relative">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>


      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-center p-3 px-20 border text-xs font-medium text-blue-800 uppercase tracking-wider"
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <ArrowUpDown className="ml-2" size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {table.getPaginationRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100 cursor-pointer">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className=" text-center border px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Completed Track Table */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="mr-2">Items per page</span>
          <select
            className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value,5));
            }}
          >
            {[5, 10, 20, 30].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={20} />
          </button>

          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={20} />
          </button>

          <span className="flex items-center">
            <input
              min={1}
              max={table.getPageCount()}
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 p-2 rounded-md border border-gray-300 text-center"
            />
            <span className="ml-1">of {table.getPageCount()}</span>
          </span>

          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={20} />
          </button>

          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
     

    </div>
    
   </>
    )
}

export default Dashboard