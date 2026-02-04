import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import EventsList from "@/components/events/EventsList";

export const metadata: Metadata = {
  title: "Events Management | Vanue Admin",
  description: "Manage events and their details",
};

export default function EventsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Events Management" />
      <div className="space-y-6">
        <ComponentCard title="Events List">
          <EventsList />
        </ComponentCard>
      </div>
    </div>
  );
}

