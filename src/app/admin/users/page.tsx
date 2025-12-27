import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import UsersList from "@/components/users/UsersList";

export const metadata: Metadata = {
  title: "Users Management | Vanue Admin",
  description: "Manage users and their roles",
};

export default function UsersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users Management" />
      <div className="space-y-6">
        <ComponentCard title="Users List">
          <UsersList />
        </ComponentCard>
      </div>
    </div>
  );
}

