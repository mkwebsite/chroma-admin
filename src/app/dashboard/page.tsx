import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

/**
 * Dashboard route - redirects to home (main dashboard)
 * This allows /dashboard to work as an alias for /
 */
export default function DashboardPage() {
  redirect(ROUTES.HOME);
}

