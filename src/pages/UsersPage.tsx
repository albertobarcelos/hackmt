
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/dashboard/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableData } from "@/lib/types";

const mockUsers: TableData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    status: "Active",
    joinDate: "2023-01-15",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2023-02-22",
    avatarUrl: "",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "Viewer",
    status: "Inactive",
    joinDate: "2023-03-10",
    avatarUrl: "",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2023-04-05",
    avatarUrl: "",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "Viewer",
    status: "Active",
    joinDate: "2023-05-18",
    avatarUrl: "",
  },
  {
    id: "6",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    role: "Administrator",
    status: "Active",
    joinDate: "2023-06-23",
    avatarUrl: "",
  },
  {
    id: "7",
    name: "David Miller",
    email: "david.m@example.com",
    role: "Editor",
    status: "Inactive",
    joinDate: "2023-07-11",
    avatarUrl: "",
  },
  {
    id: "8",
    name: "Lisa Taylor",
    email: "lisa.t@example.com",
    role: "Viewer",
    status: "Active",
    joinDate: "2023-08-09",
    avatarUrl: "",
  },
  {
    id: "9",
    name: "Kevin Martin",
    email: "kevin.m@example.com",
    role: "Editor",
    status: "Active",
    joinDate: "2023-09-14",
    avatarUrl: "",
  },
  {
    id: "10",
    name: "Amanda White",
    email: "amanda.w@example.com",
    role: "Administrator",
    status: "Inactive",
    joinDate: "2023-10-20",
    avatarUrl: "",
  },
];

const columns = [
  {
    key: "name",
    header: "Name",
    cell: (user: any) => (
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>
            {user.name.split(" ").map((n: string) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{user.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "role",
    header: "Role",
    cell: (user: any) => (
      <Badge
        variant={
          user.role === "Administrator"
            ? "default"
            : user.role === "Editor"
            ? "outline"
            : "secondary"
        }
      >
        {user.role}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (user: any) => (
      <Badge
        variant={user.status === "Active" ? "default" : "destructive"}
        className={`
          ${user.status === "Active" ? "bg-green-500" : ""}
        `}
      >
        {user.status}
      </Badge>
    ),
  },
  {
    key: "joinDate",
    header: "Join Date",
    cell: (user: any) => (
      <span>
        {new Date(user.joinDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
];

const UsersPage: React.FC = () => {
  const handleAddUser = () => {
    console.log("Add new user");
    // In a real app, you'd open a dialog or navigate to a form
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and their permissions
        </p>
      </div>

      <DataTable
        title="User Management"
        data={mockUsers}
        columns={columns}
        onAddNew={handleAddUser}
      />
    </div>
  );
};

export default UsersPage;
