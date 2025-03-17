import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/appwriteService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<{ id: string; customerName: string; status: string }[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdateStatus(order.id, "Shipped")}>Mark as Shipped</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
