import React from "react";
import { useNavigate } from "react-router-dom";

const AdminCRUD = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Admin CRUD Panel</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate("/admin/crud/create")}
          className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create
        </button>
        <button
          onClick={() => navigate("/admin/crud/update")}
          className="w-full mb-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default AdminCRUD;
