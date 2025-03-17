import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/lib/appwriteService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

export const UsersPage = () => {
    const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; profileImage: string }[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    if (data.length === 0) {
      console.warn("No users found.");
    }
    setUsers(data || []);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Profile Photo</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id || index}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className={user.role === "admin" ? "text-red-500" : "text-blue-500"}>
                {user.role}
              </TableCell>
              <TableCell>
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                ) : (
                  "No Image"
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(user.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
