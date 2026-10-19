"use client";

import { useState } from "react";
import TransactionTable from "./transaction-table";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/features/transaction/action";
import CreateTransactionCard from "./create-transaction-card";
import WizardInput from "../../_components/wizard-input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Transaction() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["transactions", page, limit, search],
    queryFn: () => getTransactions({ page, limit, search }),
  });
  return (
    <div className="space-y-6">
      <WizardInput refetch={refetch} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Daftar Transaksi
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola dan pantau semua riwayat transaksi keuanganmu.
          </p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <PlusIcon className="size-4" />
              <span>Tambah Transaksi</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-full flex-col gap-0 p-0 sm:max-w-md! rounded-3xl"
          >
            <SheetHeader className="px-5 pt-5 pb-3">
              <SheetTitle>Tambah Transaksi Baru</SheetTitle>
            </SheetHeader>

            {/* area scroll */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <CreateTransactionCard
                refetch={() => {
                  refetch();
                  setIsOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-full">
        <TransactionTable
          transactions={data}
          isLoading={isLoading}
          refetch={refetch}
          page={page}
          limit={limit}
          search={search}
          setPage={setPage}
          setLimit={setLimit}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
}
