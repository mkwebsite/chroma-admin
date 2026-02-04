import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import RoomTypesList from "@/components/room-types/RoomTypesList";

export const metadata: Metadata = {
  title: "Room Types Management | Vanue Admin",
  description: "Manage room types and their details",
};

export default function RoomTypesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Room Types Management" />
      <div className="space-y-6">
        <ComponentCard title="Room Types List">
          <RoomTypesList />
        </ComponentCard>
      </div>
    </div>
  );
}

