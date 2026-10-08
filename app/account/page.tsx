import AccountCenter, { type AccountTab } from "@/components/platform/account-center";

const accountTabs: AccountTab[] = ["overview", "recharge", "usage", "keys", "orders", "assets", "team", "invite", "tickets", "settings"];

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const params = await searchParams;
  const requested = typeof params.tab === "string" ? params.tab : "overview";
  const initialTab = accountTabs.includes(requested as AccountTab) ? requested as AccountTab : "overview";
  return <AccountCenter initialTab={initialTab}/>;
}
