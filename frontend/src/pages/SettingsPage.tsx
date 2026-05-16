import { DashboardLayout } from '../layouts/DashboardLayout';
import { User, Bell, Shield, LucideIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

const SettingsSection = ({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) => (
  <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-xl bg-primary/10 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account preferences and application settings</p>
        </div>

        <div className="grid gap-6">
          <SettingsSection title="Profile Settings" icon={User}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">Full Name</label>
                  <input type="text" className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" defaultValue="Harshi" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">Email Address</label>
                  <input type="email" className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" defaultValue="harshi@gmail.com" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </div>
          </SettingsSection>

          <SettingsSection title="Notifications" icon={Bell}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive updates about new leads via email</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-500">Receive desktop notifications for urgent tasks</p>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Security" icon={Shield}>
            <div className="space-y-4">
              <Button variant="secondary">Change Password</Button>
              <Button variant="secondary">Enable Two-Factor Authentication</Button>
            </div>
          </SettingsSection>
        </div>
      </div>
    </DashboardLayout>
  );
};
