import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axiosInstance from "@/axios/axiosInstance";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "admin" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  const handleCreateUser = async () => {
    try {
      await axiosInstance.post("/api/users", newUser);
      fetchUsers();
      setOpen(false);
      setNewUser({ username: "", password: "", role: "admin" });
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    }
  };

  const handleEditUser = async () => {
    try {
      await axiosInstance.patch(`/api/users/${selectedUser.id}`, selectedUser);
      fetchUsers();
      setOpen(false);
      setEditMode(false);
      setSelectedUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/users/${id}`);
      fetchUsers();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
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
           <Select
          value={editMode ? selectedUser?.role : newUser.role}
          onValueChange={(value) => editMode 
            ? setSelectedUser({ ...selectedUser, role: value }) 
            : setNewUser({ ...newUser, role: value })}
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-blue-200">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-md">
            <SelectItem value="admin">admin</SelectItem>
            <SelectItem value="tv1">TV</SelectItem>
          </SelectContent>
        </Select>
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
