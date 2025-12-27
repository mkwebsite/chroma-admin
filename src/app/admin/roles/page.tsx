import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import RolesList from "@/components/roles/RolesList";

export const metadata: Metadata = {
  title: "Roles Management | Vanue Admin",
  description: "Manage user roles and permissions",
};

export default function RolesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Roles Management" />
      <div className="space-y-6">
        <ComponentCard title="Roles List">
          <RolesList />
        </ComponentCard>
      </div>
    </div>
  );
}

