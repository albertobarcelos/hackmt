
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface TableData {
  id: string;
  [key: string]: any;
}

export interface Activity {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: string;
  target: string;
  timestamp: string;
}
