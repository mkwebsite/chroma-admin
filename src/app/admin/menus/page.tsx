import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import MenusList from "@/components/menus/MenusList";

export const metadata: Metadata = {
  title: "Menus Management | Vanue Admin",
  description: "Manage menus and their status",
};

export default function MenusPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Menus Management" />
      <div className="space-y-6">
        <ComponentCard title="Menus List">
          <MenusList />
        </ComponentCard>
      </div>
    </div>
  );
}

