import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/axios/axiosInstance";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await axiosInstance.post("/api/users", newUser);
      fetchUsers();
      setOpen(false);
      setNewUser({ username: "", password: "", role: "" });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axiosInstance.patch(`/api/users/${selectedUser.id}`, selectedUser);
      fetchUsers();
      setOpen(false);
      setEditMode(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => { setOpen(true); setEditMode(false); }}
        >
          Create User
        </Button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-100"
                    onClick={() => { setSelectedUser(user); setEditMode(true); setOpen(true); }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit User Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editMode ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={editMode ? selectedUser?.username : newUser.username}
              onChange={(e) => editMode 
                ? setSelectedUser({ ...selectedUser, username: e.target.value }) 
                : setNewUser({ ...newUser, username: e.target.value })}
            />
            {!editMode && (
              <Input
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            )}
            <Input
              placeholder="Role"
              value={editMode ? selectedUser?.role : newUser.role}
              onChange={(e) => editMode 
                ? setSelectedUser({ ...selectedUser, role: e.target.value }) 
                : setNewUser({ ...newUser, role: e.target.value })}
            />
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
              onClick={editMode ? handleEditUser : handleCreateUser}
            >
              {editMode ? "Update User" : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
