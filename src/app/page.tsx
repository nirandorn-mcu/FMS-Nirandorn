import { getPublicTenantInfo } from "@/features/identity/server";
import { HomePageClient } from "./_components/home-page-client";

export default async function RootPage() {
  const tenantInfo = await getPublicTenantInfo();
  return <HomePageClient initialTenant={tenantInfo} />;
}
