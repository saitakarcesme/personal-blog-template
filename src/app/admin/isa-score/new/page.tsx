import { redirect } from "next/navigation";

export default function LegacyNewIsaScoreRedirectPage() {
  redirect("/admin/cinema/new");
}
