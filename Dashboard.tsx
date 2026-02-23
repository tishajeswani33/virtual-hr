import { useHR } from '../context/HRContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Briefcase, UserPlus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
  >
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1 text-slate-800">{value}</h3>
      {trend && <p className="text-green-500 text-sm mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trend}</p>}
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const { stats, employees, candidates } = useHR();

  const deptData = employees.reduce((acc: any, curr) => {
    const existing = acc.find((item: any) => item.name === curr.department);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.department, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} color="bg-indigo-500" trend="+2 this month" />
        <StatCard title="Open Positions" value={stats.openPositions} icon={Briefcase} color="bg-purple-500" />
        <StatCard title="Active Candidates" value={stats.activeCandidates} icon={UserPlus} color="bg-pink-500" trend="+5 this week" />
        <StatCard title="Avg Performance" value={stats.avgPerformance} icon={TrendingUp} color="bg-teal-500" trend="Top 10%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Employee Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity / Candidate Pipeline Snapshot */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Recruitment Pipeline</h3>
          <div className="space-y-4">
            {candidates.slice(0, 4).map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{candidate.name}</p>
                    <p className="text-xs text-slate-500">{candidate.role}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${candidate.stage === 'Offer' ? 'bg-green-100 text-green-700' : 
                    candidate.stage === 'Interview' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'}`}>
                  {candidate.stage}
                </span>
              </div>
            ))}
             <button className="w-full text-center text-indigo-600 text-sm font-medium mt-4 hover:underline">View All Candidates</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
