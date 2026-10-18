"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAllPayments } from "@/services/payment.services";
import { CreditCard, DollarSign, Eye, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PaymentTransaction {
  id: string;
  amount: number;
  transactionId: string;
  status: string;
  createdAt: string;
  appointment?: {
    patient?: { name: string; email: string };
    doctor?: { name: string };
  };
}

const PaymentsManagementPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      return await getAllPayments();
    }
  });

  const payments = (res?.data as PaymentTransaction[]) || [];
  const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleView = (tx: PaymentTransaction) => {
    setSelectedPayment(tx);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Financials</h1>
          <p className="text-muted-foreground">
            Track patient transactions, gateway payouts, and invoice histories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Processed</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Transactions</p>
            <p className="text-2xl font-bold">{payments.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Payment Gateway</p>
            <p className="text-2xl font-bold">Stripe Active</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction Logs</CardTitle>
              <CardDescription>
                Detailed list of all Stripe gateway charges and patient consultations.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transaction ID..." className="pl-8" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-8">Failed to load payments.</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length > 0 ? (
                    payments.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs font-medium">
                          {tx.transactionId || tx.id.slice(0, 12)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {tx.appointment?.patient?.name || "Patient"}
                        </TableCell>
                        <TableCell className="text-sm">
                          Dr. {tx.appointment?.doctor?.name || "Doctor"}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          ${tx.amount}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.status === "PAID" ? "default" : "secondary"}>
                            {tx.status || "PAID"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleView(tx)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No payment transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed view of the transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div>
                <strong className="text-sm">Transaction ID:</strong>
                <p className="text-sm font-mono text-muted-foreground">
                  {selectedPayment.transactionId || selectedPayment.id}
                </p>
              </div>
              <div>
                <strong className="text-sm">Patient Name:</strong>
                <p className="text-muted-foreground">{selectedPayment.appointment?.patient?.name || "N/A"}</p>
              </div>
              <div>
                <strong className="text-sm">Doctor Name:</strong>
                <p className="text-muted-foreground">{selectedPayment.appointment?.doctor?.name || "N/A"}</p>
              </div>
              <div>
                <strong className="text-sm">Amount:</strong>
                <p className="text-muted-foreground font-semibold">${selectedPayment.amount}</p>
              </div>
              <div>
                <strong className="text-sm">Status:</strong>
                <div className="mt-1">
                  <Badge variant={selectedPayment.status === "PAID" ? "default" : "secondary"}>
                    {selectedPayment.status || "PAID"}
                  </Badge>
                </div>
              </div>
              <div>
                <strong className="text-sm">Date:</strong>
                <p className="text-muted-foreground">
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsManagementPage;