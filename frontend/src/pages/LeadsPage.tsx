import { useEffect, useState } from 'react';
import { Search, Download, Plus, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../layouts/DashboardLayout';
import api from '../services/api';
import { Lead, LeadsResponse } from '../types';
import { Button } from '../components/ui/Button';
import { cn } from '../components/ui/Button';
import { useAuthStore } from '../context/authStore';
import { LeadModal } from '../components/leads/LeadModal';

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
  const styles = {
    New: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Contacted: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Qualified: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Lost: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium border', styles[status])}>
      {status}
    </span>
  );
};

export const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<LeadsResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status }),
        ...(source && { source }),
      });
      const response = await api.get(`/leads?${params}`);
      setLeads(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, status, source, page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(status && { status }),
        ...(source && { source }),
      });
      const response = await api.get(`/leads?${params}&limit=1000`);
      const exportData = response.data.data;
      
      const headers = ['Name', 'Email', 'Status', 'Source', 'Date'];
      const csvData = exportData.map((lead: Lead) => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${new Date(lead.createdAt).toLocaleDateString()}"`
      ]);

      const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Leads Management</h1>
            <p className="text-slate-400">Manage and track your customer pipeline</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Button>
          </div>
        </div>

        <LeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchLeads} 
        />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/5 border border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-dark-200 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-dark-200 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <Button variant="secondary" onClick={() => { setSearch(''); setStatus(''); setSource(''); }}>
            Clear Filters
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Source</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Created</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-full" /></td>
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {lead.name[0]}
                          </div>
                          <span className="font-medium text-white">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{lead.email}</td>
                      <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{lead.source}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </button>
                          {user?.role === 'Admin' && (
                            <button 
                              onClick={() => handleDelete(lead._id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing <span className="text-white font-medium">{(page - 1) * 10 + 1}</span> to{' '}
                <span className="text-white font-medium">{Math.min(page * 10, pagination.total)}</span> of{' '}
                <span className="text-white font-medium">{pagination.total}</span> leads
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'primary' : 'secondary'}
                      size="sm"
                      className="w-8"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
