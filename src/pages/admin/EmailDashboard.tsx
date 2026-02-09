import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Clock, Users, UsersRound, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from "date-fns";
import { Link } from "react-router-dom";

const EmailDashboard = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: sendCount } = useQuery({
    queryKey: ["email-send-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("email_sends").select("*", { count: "exact", head: true }).eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: scheduledCount } = useQuery({
    queryKey: ["email-scheduled-count", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_schedules")
        .select("id, campaign_id!inner(user_id)")
        .eq("approved", true)
        .eq("dispatched", false);
      return data?.length || 0;
    },
    enabled: !!user,
  });

  const { data: customerCount } = useQuery({
    queryKey: ["customer-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("customers").select("*", { count: "exact", head: true }).eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: groupCount } = useQuery({
    queryKey: ["group-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("customer_groups").select("*", { count: "exact", head: true }).eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: schedules } = useQuery({
    queryKey: ["email-schedules-calendar", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_schedules")
        .select("*, email_templates(subject), email_campaigns!inner(name, user_id)")
        .eq("email_campaigns.user_id", user!.id)
        .order("scheduled_at", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: upcomingEmails } = useQuery({
    queryKey: ["upcoming-emails", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_schedules")
        .select("*, email_templates(subject), email_campaigns!inner(name, user_id)")
        .eq("email_campaigns.user_id", user!.id)
        .eq("dispatched", false)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();

  const schedulesForDate = (date: Date) =>
    schedules?.filter((s: any) => isSameDay(new Date(s.scheduled_at), date)) || [];

  const selectedSchedules = selectedDate ? schedulesForDate(selectedDate) : [];

  const stats = [
    { label: "Emails Sent", value: sendCount || 0, icon: Mail },
    { label: "Scheduled", value: scheduledCount || 0, icon: Clock },
    { label: "Customers", value: customerCount || 0, icon: Users },
    { label: "Groups", value: groupCount || 0, icon: UsersRound },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-display mb-2">Email Campaigns</h1>
            <p className="text-muted-foreground">Manage your email marketing campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/admin/email/compose">Schedule Email</Link></Button>
            <Button asChild><Link to="/admin/email/funnel">New Campaign</Link></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Schedule Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm font-medium w-32 text-center">{format(currentMonth, "MMMM yyyy")}</span>
                <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startPadding }).map((_, i) => <div key={`pad-${i}`} />)}
                {days.map((day) => {
                  const daySchedules = schedulesForDate(day);
                  const hasSchedules = daySchedules.length > 0;
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={`relative p-2 rounded-lg text-sm transition-colors ${
                        isSelected ? "bg-primary text-primary-foreground" :
                        isToday(day) ? "bg-accent" :
                        !isSameMonth(day, currentMonth) ? "text-muted-foreground/50" :
                        "hover:bg-secondary"
                      }`}
                    >
                      {format(day, "d")}
                      {hasSchedules && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  <h4 className="text-sm font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h4>
                  {selectedSchedules.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No emails scheduled</p>
                  ) : (
                    selectedSchedules.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-2 rounded border text-sm">
                        <div>
                          <p className="font-medium">{(s as any).email_campaigns?.name}</p>
                          <p className="text-muted-foreground">{(s as any).email_templates?.subject}</p>
                        </div>
                        <Badge variant={s.dispatched ? "default" : "secondary"}>
                          {s.dispatched ? "Sent" : "Scheduled"}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Upcoming Sends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!upcomingEmails?.length ? (
                <p className="text-sm text-muted-foreground">No upcoming emails</p>
              ) : (
                upcomingEmails.map((e: any) => (
                  <div key={e.id} className="border rounded p-3 space-y-1">
                    <p className="text-sm font-medium">{e.email_campaigns?.name}</p>
                    <p className="text-xs text-muted-foreground">{e.email_templates?.subject}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(e.scheduled_at), "MMM d, h:mm a")}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm"><Link to="/admin/email/campaigns">All Campaigns</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/email/customers">Customers</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/email/settings">Settings</Link></Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailDashboard;
