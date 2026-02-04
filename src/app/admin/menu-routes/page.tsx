import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import MenuRoutesList from "@/components/menu-routes/MenuRoutesList";

export const metadata: Metadata = {
  title: "Menu Routes Management | Vanue Admin",
  description: "Manage menu routes and their URLs",
};

export default function MenuRoutesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Menu Routes Management" />
      <div className="space-y-6">
        <ComponentCard title="Menu Routes List">
          <MenuRoutesList />
        </ComponentCard>
      </div>
    </div>
  );
}

