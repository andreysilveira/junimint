import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { StardewSaveData } from '@/src/lib/stardew-parser';
import { TrendingUp, Coins, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface AnalyticsProps {
  data: StardewSaveData;
}

export default function Analytics({ data }: AnalyticsProps) {
  const { player, world } = data;

  // Mock historical data for visualization
  const moneyHistory = [
    { day: 1, amount: 500 },
    { day: 7, amount: 2400 },
    { day: 14, amount: 8900 },
    { day: 21, amount: 15600 },
    { day: 28, amount: 32000 },
    { day: 35, amount: 45000 },
    { day: 42, amount: player.money },
  ];

  const skillData = Object.entries(player.skills).map(([name, skill]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    level: skill.level,
    xp: skill.experience
  }));

  const COLORS = ['#F97316', '#374151', '#FDBA74', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-3">Analytics</h1>
          <p className="text-text-secondary text-lg">Visualizing your farm's growth and performance.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary text-sm px-6">Export Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Money Progression */}
        <div className="glass-card p-10">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
              <Coins className="text-stardew-primary" size={22} />
              Wealth Accumulation
            </h3>
            <span className="text-[10px] font-bold text-stardew-primary bg-stardew-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moneyHistory}>
                <defs>
                  <linearGradient id="colorMoney" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', fontSize: '14px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#F97316', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#F97316" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorMoney)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Levels */}
        <div className="glass-card p-10">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
              <Trophy className="text-stardew-primary" size={22} />
              Skill Distribution
            </h3>
            <span className="text-[10px] font-bold text-text-secondary bg-bg-muted px-3 py-1 rounded-full uppercase tracking-widest">Level 1-10</span>
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  domain={[0, 10]} 
                  dx={-15}
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', fontSize: '14px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="level" radius={[6, 6, 0, 0]} barSize={48}>
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal Insights */}
      <div className="glass-card p-10">
        <h3 className="text-xl font-bold text-text-primary mb-12 flex items-center gap-3">
          <Calendar className="text-stardew-secondary" size={22} />
          Seasonal Cycle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
            <div key={season} className={cn(
              "p-8 rounded-2xl border transition-all duration-300",
              world.currentSeason.toLowerCase() === season.toLowerCase() 
                ? "border-stardew-primary/30 bg-stardew-primary/5 shadow-sm" 
                : "border-border-light bg-bg-surface"
            )}>
              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{season}</p>
                {world.currentSeason.toLowerCase() === season.toLowerCase() && (
                  <div className="w-2.5 h-2.5 rounded-full bg-stardew-primary animate-pulse" />
                )}
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {world.currentSeason.toLowerCase() === season.toLowerCase() ? 'Current' : 'Inactive'}
              </p>
              <div className="mt-8 h-2 bg-bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: world.currentSeason.toLowerCase() === season.toLowerCase() ? '100%' : '0%' }}
                  className={cn(
                    "h-full transition-all duration-1000",
                    world.currentSeason.toLowerCase() === season.toLowerCase() ? "bg-stardew-primary" : "bg-bg-muted"
                  )} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
