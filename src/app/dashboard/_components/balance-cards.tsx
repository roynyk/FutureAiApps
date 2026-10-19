import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convertToIDR } from "@/lib/utils";
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

export function BalanceCards({
  data,
  error,
}: {
  data:
    | { savings: number; totalIncome: number; totalExpense: number }
    | undefined;
  error: unknown;
}) {
  if (error) {
    return (
      <div className="w-full p-4 text-sm border rounded-lg border-destructive/50 text-destructive bg-destructive/10">
        Failed to get a balance
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="md:col-span-2 relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-medium">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <WalletIcon className="size-5" />
              </div>
              <span>Total Tabungan (Net Savings)</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
              Live Balance
            </span>
          </div>

          <div>
            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              {convertToIDR(Number(data?.savings || 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Akumulasi saldo bersih dari seluruh pemasukan dikurangi
              pengeluaran.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="flex-1 shadow-sm hover:shadow-md transition-all duration-300 border-border/60">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Pemasukan (Income)
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUpIcon className="size-4" />
              </div>
            </div>
            <CardDescription className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {convertToIDR(Number(data?.totalIncome || 0))}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
            Total pemasukan tercatat
          </CardFooter>
        </Card>

        <Card className="flex-1 shadow-sm hover:shadow-md transition-all duration-300 border-border/60">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Pengeluaran (Expense)
              </CardTitle>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <TrendingDownIcon className="size-4" />
              </div>
            </div>
            <CardDescription className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {convertToIDR(Number(data?.totalExpense || 0))}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
            Total pengeluaran tercatat
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
