import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2, ArrowLeft, Package, User, MapPin, CreditCard, Truck,
  Calendar, Activity, Key, ShoppingCart, Sparkles, CheckCircle2, XCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isAmazonOrder = (order: any) =>
  order?.stripe_session_id?.startsWith("amz_") || false;

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [statusUpdating, setStatusUpdating] = useState(false);

  // ── Fetch order + entitlement ───────────────────────────────────────────────
  const { data: orderData, isLoading, error, isError } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      if (!id) throw new Error("No order ID provided");

      // 1. Fetch the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
      if (orderError) throw orderError;

      // 2. Fetch order items
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      // 3. Fetch entitlement for this order
      const { data: entitlements } = await supabase
        .from("entitlements")
        .select("*")
        .eq("order_id", id);

      return {
        ...order,
        order_items: items || [],
        entitlement: entitlements?.[0] || null,
      };
    },
    enabled: !!id,
  });

  // ── Status update mutation ──────────────────────────────────────────────────
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!id) throw new Error("No order ID provided");
      setStatusUpdating(true);
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      return newStatus;
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      toast.success(`Order status updated to ${newStatus}`);
      setStatusUpdating(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
      setStatusUpdating(false);
    },
  });

  // ── Loading / Error / Not Found states ──────────────────────────────────────
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-serif mb-2 text-destructive">Error Loading Order</h2>
          <p className="text-muted-foreground mb-6">{(error as Error)?.message || "An unknown error occurred."}</p>
          <Button asChild><Link to="/admin/orders">Back to Orders</Link></Button>
        </div>
      </AdminLayout>
    );
  }

  if (!orderData) {
    return (
      <AdminLayout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-serif mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">The order you are looking for does not exist.</p>
          <Button asChild><Link to="/admin/orders">Back to Orders</Link></Button>
        </div>
      </AdminLayout>
    );
  }

  const order = orderData;
  const amazon = isAmazonOrder(order);
  const items = order.order_items?.length ? order.order_items : (Array.isArray(order.items) ? order.items : []);
  const shipping = order.shipping_address as Record<string, string> | null;
  const orderNumber = order.order_number || `HW-${order.id.substring(0, 8).toUpperCase()}`;
  const entitlement = order.entitlement;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/admin/orders"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl md:text-3xl">
                {amazon ? "Redemption" : "Order"} {orderNumber}
              </h1>
              {amazon ? (
                <Badge variant="outline" className="gap-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                  <Key size={10} /> Amazon
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400">
                  <ShoppingCart size={10} /> Website
                </Badge>
              )}
              <Badge variant="outline" className="uppercase text-xs">{order.status}</Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* AI Designer Access Card (Amazon redeems) */}
            {amazon && (
              <Card className={entitlement?.status === "active"
                ? "border-emerald-200 dark:border-emerald-800/40"
                : "border-amber-200 dark:border-amber-800/40"
              }>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" /> AI Designer Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {entitlement ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-medium text-sm">Access Granted</p>
                          <p className="text-xs text-muted-foreground">
                            This Amazon order has been successfully redeemed for AI Designer access.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant={entitlement.status === "active" ? "default" : "secondary"} className={entitlement.status === "active" ? "bg-emerald-600 mt-1" : "mt-1"}>
                            {entitlement.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Product</p>
                          <p className="font-medium capitalize">{entitlement.product_type?.replace("-", " ")}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Source</p>
                          <p className="font-medium capitalize">{entitlement.source}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Activated</p>
                          <p className="font-medium">{new Date(entitlement.created_at).toLocaleDateString()}</p>
                        </div>
                        {entitlement.expires_at && (
                          <div>
                            <p className="text-muted-foreground">Expires</p>
                            <p className="font-medium">{new Date(entitlement.expires_at).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <XCircle size={20} className="text-amber-600 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Not Yet Redeemed</p>
                        <p className="text-xs text-muted-foreground">
                          This order exists in the system but the customer hasn't completed the redemption process yet.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Items (Website orders) */}
            {!amazon && items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" /> Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item: any, index: number) => (
                      <div key={item.id || index} className="flex justify-between items-center py-2 border-b last:border-0 border-divider">
                        <div>
                          <p className="font-medium">{item.product_name || item.name}</p>
                          <p className="text-sm text-muted-foreground">Type: {item.product_type || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${((item.unit_amount || item.price || 0) / 100).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amazon Order Verification Info */}
            {amazon && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" /> Amazon Order Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amazon Order ID</p>
                      <p className="font-medium font-mono text-sm">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Verification Method</p>
                      <p className="font-medium capitalize">
                        {(order.items as any)?.verify_method || "SP-API"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Source</p>
                      <p className="font-medium capitalize">
                        {(order.items as any)?.source || "Amazon"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Linked</p>
                      <p className="font-medium">
                        {order.user_id ? "Yes ✓" : "No — pending"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* MCF Fulfillment (Website orders only) */}
            {!amazon && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Fulfillment Status (MCF)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">MCF Order ID</p>
                      <p className="font-medium">{order.mcf_order_id || "Not submitted"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">MCF Status</p>
                      <Badge variant={order.mcf_status === "error" ? "destructive" : "secondary"}>
                        {order.mcf_status || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  {order.mcf_error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800/40">
                      <strong>Error: </strong> {order.mcf_error}
                    </div>
                  )}
                  {order.mcf_submitted_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted At</p>
                      <p className="font-medium">{new Date(order.mcf_submitted_at).toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Management */}
            <Card>
              <CardHeader>
                <CardTitle>Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Status</label>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(val) => updateStatusMutation.mutate(val)}
                    disabled={statusUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updating the status here only updates the database record.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details (Website) or Order Info (Amazon) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {amazon ? "Order Info" : "Payment Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!amazon && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-lg">${(order.total_amount / 100).toFixed(2)} {order.currency?.toUpperCase()}</span>
                    </div>
                    <Separator />
                  </>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">
                    {amazon ? "Internal Reference" : "Stripe Session ID"}
                  </p>
                  <p className="text-xs font-mono break-all">{order.stripe_session_id}</p>
                </div>
                {amazon && (
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">AI Designer Redemption (Free with Amazon purchase)</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer_email || "N/A"}</p>
                </div>
                {order.user_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="text-xs font-mono">{order.user_id}</p>
                  </div>
                )}
                {!order.user_id && amazon && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-xs rounded-md border border-amber-200 dark:border-amber-800/40">
                    Customer has not yet created an account to claim this redemption.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping (Website only) */}
            {!amazon && shipping && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>{shipping.name}</p>
                    <p>{shipping.line1}</p>
                    {shipping.line2 && <p>{shipping.line2}</p>}
                    <p>{shipping.city}, {shipping.state} {shipping.postal_code}</p>
                    <p>{shipping.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
