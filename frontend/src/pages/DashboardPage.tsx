import { useEffect, useState } from 'react';
import { Users, UserCheck, UserMinus, UserPlus, TrendingUp, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../layouts/DashboardLayout';
import api from '../services/api';
import { StatsResponse } from '../types';
import { cn } from '../components/ui/Button';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group"
  >
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 opacity-20", color)} />
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10 text-white", color.replace('bg-', 'text-'))}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<StatsResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/leads/stats');
        setStats(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Analytics Overview</h1>
          <p className="text-slate-400">Track your performance and lead metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads || 0}
            icon={Users}
            trend="+12.5%"
            color="bg-primary"
          />
          <StatCard
            title="Qualified Leads"
            value={stats?.qualifiedLeads || 0}
            icon={UserCheck}
            trend="+8.2%"
            color="bg-emerald-500"
          />
          <StatCard
            title="Lost Leads"
            value={stats?.lostLeads || 0}
            icon={UserMinus}
            trend="-2.4%"
            color="bg-red-500"
          />
          <StatCard
            title="New Leads"
            value={stats?.newLeads || 0}
            icon={UserPlus}
            trend="+14.1%"
            color="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6">Performance Graph</h3>
            <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl text-slate-500">
              Chart implementation here (e.g. Recharts)
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">New lead added</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
