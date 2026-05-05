import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Package, User, MapPin, CreditCard, Truck, Calendar, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: async () => {
      if (!id) throw new Error("No order ID provided");
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

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
    }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-serif mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">The order you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/admin/orders">Back to Orders</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const items = order.order_items || (Array.isArray(order.items) ? order.items : []);
  const shipping = order.shipping_address as Record<string, string> | null;
  const orderNumber = order.order_number || `HW-${order.id.substring(0, 8).toUpperCase()}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl flex items-center gap-3">
              Order {orderNumber}
              <Badge variant="outline" className="uppercase text-xs">{order.status}</Badge>
            </h1>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
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
          </div>

          <div className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-lg">${(order.total_amount / 100).toFixed(2)} {order.currency?.toUpperCase()}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Stripe Session ID</p>
                  <p className="text-xs font-mono break-all">{order.stripe_session_id}</p>
                </div>
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>

            {shipping && (
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
