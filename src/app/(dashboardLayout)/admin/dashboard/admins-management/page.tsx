import AdminsTable from "@/components/modules/Admin/AdminsManagement/AdminsTable";
import { getAllAdmins, IAdminUser } from "@/services/admin.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const AdminsManagementPage = async () => {
  let initialAdmins: IAdminUser[] = [];
  try {
    const res = await getAllAdmins();
    if (res?.data && Array.isArray(res.data)) {
      initialAdmins = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch initial admins:", error);
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: getAllAdmins,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminsTable initialAdmins={initialAdmins} />
    </HydrationBoundary>
  );
};

export default AdminsManagementPage;