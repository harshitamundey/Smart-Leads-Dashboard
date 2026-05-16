import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerSchema, RegisterInput } from '../validators/auth.validator';
import { useAuthStore } from '../context/authStore';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User'
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', data);
      setAuth(response.data.data, response.data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] px-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 mb-6 shadow-glow-lg">
            <span className="text-white font-bold text-2xl">SL</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-400">Join SmartLeads and start managing your leads</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-[38px] w-4 h-4 text-slate-500" />
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-[38px] w-4 h-4 text-slate-500" />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-[38px] w-4 h-4 text-slate-500" />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Role
                </label>
                <select
                  {...register('role')}
                  className="flex h-10 w-full rounded-lg border border-white/10 bg-dark-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
                >
                  <option value="Sales User">Sales User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base group" isLoading={isLoading}>
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
