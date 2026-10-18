"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISpecialty } from "@/types/specialty.types";
import { Hospital, Plus, Stethoscope, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getAllSpecialties, createSpecialty, deleteSpecialty } from "@/services/specialty.services";

const SpecialtiesManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["specialties"],
    queryFn: getAllSpecialties,
  });

  const specialties = (res?.data as ISpecialty[]) || [];

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await createSpecialty(formData);
    },
    onSuccess: () => {
      toast.success("Specialty created successfully");
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      setIsAddOpen(false);
      setTitle("");
    },
    onError: (error) => {
      toast.error("Failed to create specialty");
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteSpecialty(id);
    },
    onSuccess: () => {
      toast.success("Specialty deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete specialty");
      console.error(error);
      setDeletingId(null);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify({ title }));
    // File upload logic would go here if icon is provided
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Specialties Management</h1>
          <p className="text-muted-foreground">
            Configure medical departments, clinical specialties, and specialty icons.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Add Specialty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Add New Specialty</DialogTitle>
                <DialogDescription>
                  Create a new clinical specialty or medical department.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Specialty Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Cardiology" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">Failed to load specialties.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((spec) => (
              <Card key={spec.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold">{spec.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Active Department
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
                  <Badge variant="outline">ID: {spec.id.slice(0, 6)}</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeletingId(spec.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Medical Specialties</CardTitle>
              <CardDescription>
                Master list of all hospital healthcare disciplines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specialty Title</TableHead>
                      <TableHead>System ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialties.length > 0 ? (
                      specialties.map((spec) => (
                        <TableRow key={spec.id}>
                          <TableCell className="font-semibold flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-primary" />
                            <span>{spec.title}</span>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {spec.id}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingId(spec.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          No specialties added yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(isOpen) => !isOpen && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the specialty from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpecialtiesManagementPage;