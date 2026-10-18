"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IAdminUser } from "@/services/admin.services";
import { getAllAdmins } from "@/services/admin.services";
import { useQuery } from "@tanstack/react-query";
import { Lock, Search, Shield, User } from "lucide-react";
import { useState } from "react";
import CreateAdminModal from "./CreateAdminModal";
import DeleteAdminDialog from "./DeleteAdminDialog";

interface AdminsTableProps {
  initialAdmins: IAdminUser[];
}

const AdminsTable = ({ initialAdmins }: AdminsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: adminsResponse, refetch } = useQuery({
    queryKey: ["admins"],
    queryFn: getAllAdmins,
    initialData: { success: true, message: "", data: initialAdmins },
  });

  const admins = adminsResponse?.data ?? initialAdmins;

  const filteredAdmins = admins.filter((admin) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      admin.name?.toLowerCase().includes(term) ||
      admin.email?.toLowerCase().includes(term) ||
      admin.contactNumber?.toLowerCase().includes(term) ||
      admin.user?.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage system administrators, permissions, and security roles.
          </p>
        </div>
        <CreateAdminModal onSuccess={() => void refetch()} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>System Administrators</CardTitle>
              <CardDescription>
                {admins.length} total administrators configured in the system.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admins..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => {
                    const isSuperAdmin =
                      admin.email === "superadmin@smartcare.com" ||
                      admin.user?.role === "SUPER_ADMIN";

                    return (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <span className="truncate">{admin.name}</span>
                            {isSuperAdmin && (
                              <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200">
                                <Lock className="w-2.5 h-2.5 mr-0.5" />
                                Protected
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge variant={isSuperAdmin ? "default" : "secondary"} className="capitalize">
                            <Shield className="w-3 h-3 mr-1" />
                            {admin.user?.role || (isSuperAdmin ? "SUPER_ADMIN" : "ADMIN")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.isDeleted ? "destructive" : "default"}>
                            {admin.isDeleted ? "Inactive" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {admin.contactNumber || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DeleteAdminDialog admin={admin} onSuccess={() => void refetch()} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No admin users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminsTable;
