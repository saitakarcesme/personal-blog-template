import { redirect } from "next/navigation";

export default async function LegacyIsaScoreDetailRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/cinema/${slug}`);
}
