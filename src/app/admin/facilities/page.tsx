import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import FacilitiesList from "@/components/facilities/FacilitiesList";

export const metadata: Metadata = {
  title: "Facilities Management | Vanue Admin",
  description: "Manage facilities and their details",
};

export default function FacilitiesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Facilities Management" />
      <div className="space-y-6">
        <ComponentCard title="Facilities List">
          <FacilitiesList />
        </ComponentCard>
      </div>
    </div>
  );
}

