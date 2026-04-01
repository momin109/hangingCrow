import DashboardLayout from "@/components/layout/DashboardLayout";
import UserCreateForm from "@/components/users/UserCreateForm";

export default function CreateUserPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create User</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a child account based on your role hierarchy
        </p>
      </div>

      <UserCreateForm />
    </DashboardLayout>
  );
}
