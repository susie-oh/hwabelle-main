import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, ShoppingBag, Package, RefreshCw, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

type Metric = {
  date: string;
  total_orders: number;
  total_units: number;
  total_revenue_usd: number;
};

type TimeRange = "7" | "30" | "90";

export function AmazonOrdersCard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30");
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ["hwabelle-amazon-sales-metrics", timeRange],
    queryFn: async (): Promise<Metric[]> => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const { data, error } = await supabase
        .from("amazon_sales_metrics")
        .select("date, total_orders, total_units, total_revenue_usd")
        .gte("date", startDate.toISOString().substring(0, 10))
        .order("date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const totals = metrics?.reduce(
    (acc, row) => ({
      orders: acc.orders + row.total_orders,
      units: acc.units + row.total_units,
      revenue: acc.revenue + Number(row.total_revenue_usd),
    }),
    { orders: 0, units: 0, revenue: 0 }
  ) ?? { orders: 0, units: 0, revenue: 0 };

  const chartData = metrics?.map((row) => ({
    date: new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Revenue: Number(row.total_revenue_usd),
    Orders: row.total_orders,
    Units: row.total_units,
  })) ?? [];

  const handleSyncNow = async () => {
    setIsSyncing(true);
    toast({ title: "Syncing Amazon Orders…", description: "Fetching latest sales data from SP-API." });

    try {
      const { data, error } = await supabase.functions.invoke("sync-amazon-orders", {
        body: { days: parseInt(timeRange) },
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.message);

      toast({
        title: "Sync Complete!",
        description: data?.message || "Amazon orders successfully synced.",
      });
      refetch();
    } catch (err: any) {
      console.error("Amazon Orders Sync Error:", err);
      toast({
        title: "Sync Failed",
        description: err.message || "Could not sync Amazon order data.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-display flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Amazon Orders
          </h2>
          <p className="text-muted-foreground text-sm">Sales revenue, units &amp; order volume via SP-API</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeRange(opt.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  timeRange === opt.value
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing…" : "Sync Now"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <DollarSign size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    ${totals.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{totals.orders.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Package size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{totals.units.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Units Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif">Revenue Trend</CardTitle>
            <CardDescription>Daily Amazon sales over the selected window</CardDescription>
          </div>
          {metrics && metrics.length > 0 && (
            <Badge variant="outline" className="text-[10px]">
              {metrics.length} days of data
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 text-center text-muted-foreground">
              <Package className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">No data for this period</p>
              <p className="text-xs mt-1 max-w-xs">
                Click &quot;Sync Now&quot; to pull orders from Amazon. Data will appear here after the first sync.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "Revenue" ? [`$${value.toFixed(2)}`, name] : [value, name]
                  }
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Revenue" stroke="#d97706" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Orders" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
