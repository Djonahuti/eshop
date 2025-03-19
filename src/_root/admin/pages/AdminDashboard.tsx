import { UsersPage } from "./UsersPage";


export default function AdminDashboard() {

  return (
    <div className="flex h-screen">

      {/* Main Content */}
      <main className="flex-1 p-6">
        <UsersPage />
      </main>
    </div>
  );
};
