import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import PropertyTypesList from "@/components/property-types/PropertyTypesList";

export const metadata: Metadata = {
  title: "Property Types Management | Vanue Admin",
  description: "Manage property types and their details",
};

export default function PropertyTypesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Property Types Management" />
      <div className="space-y-6">
        <ComponentCard title="Property Types List">
          <PropertyTypesList />
        </ComponentCard>
      </div>
    </div>
  );
}

