import Sidebar from "../components/sidebar"
import regUserData from "../regUserData.json"
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
  IdCard,
  Phone,
  ChartLine,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { database } from '../firebase.config';
import { ref, get, child, onValue, remove, set, update } from "firebase/database";
import { Pencil, Trash } from "lucide-react";
import {toast, ToastContainer} from 'react-toastify'
import Swal from "sweetalert2";




function Users(){

const handleDelete = async (user) => {
  if (!user || !user.CustomUserId) {
    console.error("Invalid user data");
    return;
  }
  
  const confirmAction = await Swal.fire({
    title: `Are you sure you want to Delete ${user.Name}?`,
    text: "This cannot be undone.",
    icon: '',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    customClass:{
      confirmButton: "confirm-button",
      cancelButton: "cancel-button"
    }
  })

if (!confirmAction.isConfirmed) return;
  

  const usersRef = ref(database, "users");

  try {
    // Get all users
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      console.log("No users found.");
      return;
    }

    let userKey = null;
    let userData = null;

    // Loop through users to find the correct Firebase key
    snapshot.forEach((childSnapshot) => {
      const userInfo = childSnapshot.val();
      if (userInfo.CustomUserId === user.CustomUserId) {
        userKey = childSnapshot.key; // Get the actual Firebase key
        userData = userInfo;
      }
    });

    if (!userKey) {
      console.log("User not found.");
      return;
    }

    // Move user to ArchivedUsers table
    const archiveRef = ref(database, `ArchivedUsers/${userKey}`);
    await set(archiveRef, userData);

    // Remove user from Users table
    await remove(ref(database, `users/${userKey}`));

    console.log(`User ${user.CustomUserId} has been deleted.`);
    toast(`User ${user.Name} has been deleted.`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const handleUpdate = async () => {
  if (!selectedUser || !selectedUser.CustomUserId) return;

  const usersRef = ref(database, "users");

  try {
    // Find the correct Firebase key
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      console.log("No users found.");
      return;
    }

    let userKey = null;

    snapshot.forEach((childSnapshot) => {
      const userInfo = childSnapshot.val();
      if (userInfo.CustomUserId === selectedUser.CustomUserId) {
        userKey = childSnapshot.key;
      }
    });

    if (!userKey) {
      console.log("User not found.");
      return;
    }

    // Update user data in Firebase
    await update(ref(database, `users/${userKey}`), selectedUser);

    console.log(`User ${selectedUser.CustomUserId} has been updated.`);
    alert(`User ${selectedUser.Name} has been updated.`);

    setIsEditing(false); // Close modal
  } catch (error) {
    console.error("Error updating user:", error);
  }
};



const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("CustomUserId", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <IdCard className="mr-2" size={18} /> UserID
        <ArrowUpDown className="ml-2" size={14} />
      </span>
    ),
  }),
  columnHelper.accessor("Contact_Number", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Phone className="mr-2" size={16} /> Contact Number
        <ArrowUpDown className="ml-2" size={14} />
      </span>
    ),
  }),
  columnHelper.accessor("Name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> Name
        <ArrowUpDown className="ml-2" size={14} />
      </span>
    ),
  }),
  columnHelper.accessor("Email", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Mail className="mr-2" size={16} /> Email
        <ArrowUpDown className="ml-2" size={14} />
      </span>
    ),
  }),
  columnHelper.accessor("Verification_Status", {
    cell: (info) => (
      <span
        className={`italic text-white p-2 px-3.5 rounded-3xl ${
          info.getValue() === "Verified"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        {info.getValue()}
      </span>
    ),
    header: () => (
      <span className="flex items-center">
        <ChartLine className="mr-2" size={16} /> Status
        <ArrowUpDown className="ml-2" size={14} />
      </span>
    ),
  }),

  columnHelper.accessor("Action", {
    cell: (info) => (
      <div className="space-x-2">  
        {/* <button
          onClick={() => handleEdit(info.row.original)}
          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-800 transition"
        >
          <Pencil size={18} />
        </button> */}
        <button
  onClick={() => handleDelete(info.row.original)}
  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-800 transition"
>
  <Trash size={18} />
</button>
      </div>
    ),
    header: () => <span>Action</span>,
  }),
];




  const [data, setData] = useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
    const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);  // Store the selected user's data
    setIsEditing(true);  // Open the edit modal
  };

  const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: 8,
    });

    useEffect(() => {
      // Listen for real-time data updates
      const dbRef = ref(database, "users");
      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const formattedData = Object.values(usersData).map((user) => ({
            CustomUserId: user.CustomUserId,
            Contact_Number: user.Contact_Number,
            Name: user.Name,
            Email: user.Email,
            Verification_Status: user.Verification_Status,
          }));
          setData(formattedData); // Update the state with the new data
        } else {
          console.log("No data available");
        }
      });
  
      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }, []);

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
      <div className ="d-container">
      <div className="p-7 border border-solid">
      <h2 className= "font-nobile text-[#1c2e8b] text-3xl font-medium"> Users Record</h2>
        </div>
          <div className="flex flex-col min-h-full max-xl:-4xl py-6 px-4 sm:px-6 lg:px-8">
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
                             className="text-center p-3 px-20 border text-xs font-medium text-blue-800 uppercase tracking-wider "
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
                     {[8, 20, 30].map((pageSize) => (
                       <option key={pageSize} value={pageSize}>
                         {pageSize}
                       </option>
                     ))}
                   </select>
                 </div>

                 {isEditing && selectedUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>

      {/* UserID (Read-Only) */}
      <div className="mb-3">
        <label className="block text-gray-700">User ID:</label>
        <input
          type="text"
          value={selectedUser.CustomUserId}
          className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          disabled
        />
      </div>

      {/* Contact Number */}
      <div className="mb-3">
        <label className="block text-gray-700">Contact Number:</label>
        <input
          type="text"
          value={selectedUser.Contact_Number}
          onChange={(e) => setSelectedUser({ ...selectedUser, Contact_Number: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Name */}
      <div className="mb-3">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          value={selectedUser.Name}
          onChange={(e) => setSelectedUser({ ...selectedUser, Name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          value={selectedUser.Email}
          onChange={(e) => setSelectedUser({ ...selectedUser, Email: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Verification Status */}
      <div className="mb-3">
        <label className="block text-gray-700">Verification Status:</label>
        <select
          value={selectedUser.Verification_Status}
          onChange={(e) => setSelectedUser({ ...selectedUser, Verification_Status: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Verified">Verified</option>
          <option value="Not Verified">Not Verified</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

         
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
             <ToastContainer position="top-center"/>
            </>
    
      
    )
}

export default Users