
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity } from "@/lib/types";

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto px-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 relative pb-6 last:pb-0"
            >
              <div className="z-10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {activity.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-card-foreground">
                  <span className="font-semibold">{activity.user.name}</span>{" "}
                  {activity.action} {activity.target}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
