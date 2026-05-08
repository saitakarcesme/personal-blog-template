import { redirect } from "next/navigation";

export default async function LegacyEditIsaScoreRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/admin/cinema/edit/${slug}`);
}
