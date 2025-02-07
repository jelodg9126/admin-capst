import Sidebar from "../components/sidebar";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Mail, User, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { database } from '../firebase.config';
import { ref, get, child, onValue, set, remove, update } from "firebase/database";
import { Pencil, Trash } from "lucide-react";
import {toast, ToastContainer} from 'react-toastify'

const Admin = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  // State for Edit Feature
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({ Name: "", Username: "" });
  const [originalUsername, setOriginalUsername] = useState("");

  // Fetch Data from Firebase
  useEffect(() => {
    const dbRef = ref(database, "admin");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        const formattedData = Object.keys(adminData).map((key) => ({
          ...adminData[key],
          id: key, // Preserve the Firebase ID
        }));
        setData(formattedData);
      } else {
        console.log("No data available");
      }
    });

    return () => unsubscribe();
  }, []);

  // Delete Function (Archive then Delete)
  const handleDelete = async (admin) => {

     const confirmAction = await Swal.fire({
                title: 'Confirm Logout',
                text: 'Are you sure you want to delete ${admin.Name}?',
                icon: '',
                confirmButtonText: 'Yes',
                showCancelButton: true,
                customClass:{
                  confirmButton: "confirm-button",
                  cancelButton: "cancel-button"
                }
              })
    
       if (!confirmAction.isConfirmed) {

      const adminRef = ref(database, `admin/${admin.Username}`);
      const archiveRef = ref(database, `ArchiveEmp/${admin.Username}`);

      set(archiveRef, admin)
        .then(() => remove(adminRef))
        .then(() => toast.success("Admin archived successfully!"))
        .catch((error) => toast.error("Error archiving admin: " + error.message));
    }
  };

  // Edit Function (Opens Modal)
  const handleEdit = (admin) => {
    setCurrentAdmin({ ...admin, originalUsername: admin.Username });
    setIsEditModalOpen(true);
  };

  // Save Edited Data to Firebase (Handles Username Changes)
  const handleSaveEdit = async () => {
    const oldAdminRef = ref(database, `admin/${currentAdmin.originalUsername}`); // Old reference
    const newAdminRef = ref(database, `admin/${currentAdmin.Username}`); // New reference
  
    try {
      // Get the current admin data
      const snapshot = await get(oldAdminRef);
      if (snapshot.exists()) {
        const existingData = snapshot.val();
  
        // Prepare updated data (preserving password)
        const updatedData = {
          Name: currentAdmin.Name,
          Username: currentAdmin.Username,
          Password: currentAdmin.Password, // Keep old password
        };
  
        if (currentAdmin.Username !== currentAdmin.originalUsername) {
          // If username changed, create a new entry and delete the old one
          await set(newAdminRef, updatedData);
          await remove(oldAdminRef);
        } else {
          // If username didn't change, just update the existing entry
          await update(oldAdminRef, updatedData);
        }
  
        toast.success("Admin updated successfully!");
        setIsEditModalOpen(false);
      } else {
        toast.warn("Admin record not found!");
      }
    } catch (error) {
       toast.error("Error updating admin: " + error.message);
    }
  };
  
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("Name", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <User className="mr-2" size={16} /> Name
          <ArrowUpDown className="ml-2" size={14} />
        </span>
      ),
    }),
    columnHelper.accessor("Username", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <Mail className="mr-2" size={16} /> Username
           <ArrowUpDown className="ml-2" size={14} />
        </span>
      ),
    }),
    
    columnHelper.accessor("Action", {
      cell: (info) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-800 transition"
          >
            <Pencil size={18} />
          </button>
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

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Sidebar />
      <div className="d-container">
        <div className="p-7 border border-solid">
          <h2 className="font-nobile text-[#1c2e8b] text-3xl font-medium">Employee Record</h2>
        </div>
        <div className="flex flex-col min-h-full py-6 px-4 mx-auto sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-4 relative">
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-center p-3 px-24 border text-xs font-medium text-blue-800 uppercase tracking-wider">
                        <div onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none flex items-center">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                         
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
                      <td key={cell.id} className="text-center border px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

{/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4 text-center">Edit Admin</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Name</label>
        <input
          type="text"
          value={currentAdmin.Name}
          onChange={(e) => setCurrentAdmin({ ...currentAdmin, Name: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Enter Name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Username</label>
        <input
          type="text"
          value={currentAdmin.Username}
          onChange={(e) => setCurrentAdmin({ ...currentAdmin, Username: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Enter Username"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
        <input
          type="password"
          value={currentAdmin.Password}
          onChange={(e) => setCurrentAdmin({ ...currentAdmin, Password: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Enter Password"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button 
          onClick={() => setIsEditModalOpen(false)} 
          className="bg-gray-500 px-4 py-2 rounded text-white hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveEdit} 
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-800"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
<ToastContainer/>
    </>
  );
};

export default Admin;
