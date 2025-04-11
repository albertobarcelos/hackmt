
import React from "react";
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  ShoppingCart,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import AreaChart from "@/components/dashboard/AreaChart";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { Activity as ActivityType } from "@/lib/types";

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 780 },
  { name: "May", value: 700 },
  { name: "Jun", value: 950 },
  { name: "Jul", value: 1100 },
];

const usersData = [
  { name: "Jan", value: 50 },
  { name: "Feb", value: 80 },
  { name: "Mar", value: 110 },
  { name: "Apr", value: 130 },
  { name: "May", value: 170 },
  { name: "Jun", value: 220 },
  { name: "Jul", value: 290 },
];

const activities: ActivityType[] = [
  {
    id: "1",
    user: { name: "John Doe" },
    action: "created a new task",
    target: "Project X Launch",
    timestamp: "Just now",
  },
  {
    id: "2",
    user: { name: "Alice Miller" },
    action: "updated the status of",
    target: "Website Redesign",
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    user: { name: "Robert Johnson" },
    action: "completed",
    target: "Quarterly Reports",
    timestamp: "5 hours ago",
  },
  {
    id: "4",
    user: { name: "Emma Wilson" },
    action: "assigned",
    target: "New Feature Development",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    user: { name: "Michael Brown" },
    action: "commented on",
    target: "Bug #4321",
    timestamp: "2 days ago",
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$13,456.78"
          icon={<DollarSign size={20} />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="New Users"
          value="2,345"
          icon={<Users size={20} />}
          trend={{ value: 18.2, isPositive: true }}
        />
        <StatsCard
          title="Orders"
          value="452"
          icon={<ShoppingCart size={20} />}
          trend={{ value: 5.3, isPositive: false }}
        />
        <StatsCard
          title="Payments"
          value="$4,679.23"
          icon={<CreditCard size={20} />}
          trend={{ value: 8.9, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AreaChart
          title="Revenue Growth"
          data={chartData}
          dataKey="value"
          height={320}
        />
        <AreaChart
          title="User Growth"
          data={usersData}
          dataKey="value"
          height={320}
          areaColor="hsla(130, 60%, 59%, 0.8)"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <RecentActivityCard activities={activities} />
      </div>
    </div>
  );
};

export default DashboardPage;
