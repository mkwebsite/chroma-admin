import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import EventTypesList from "@/components/event-types/EventTypesList";

export const metadata: Metadata = {
  title: "Event Types Management | Vanue Admin",
  description: "Manage event types and their details",
};

export default function EventTypesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Event Types Management" />
      <div className="space-y-6">
        <ComponentCard title="Event Types List">
          <EventTypesList />
        </ComponentCard>
      </div>
    </div>
  );
}

