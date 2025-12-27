import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

/**
 * Root page - redirects to admin dashboard
 * This ensures / route works and redirects to the main dashboard
 */
export default function HomePage() {
  redirect("/admin");
}

