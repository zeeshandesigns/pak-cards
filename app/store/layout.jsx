import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
  title: "PakCards - Store Dashboard",
  description: "PakCards Seller Dashboard - Manage your gift card store",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <StoreLayout>{children}</StoreLayout>
    </>
  );
}
