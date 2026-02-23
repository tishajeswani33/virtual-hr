import React, { useState } from 'react';
import { useHR, Employee } from '../context/HRContext';
import { Search, Plus, Filter, MoreHorizontal, Mail, Briefcase, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Employees = () => {
  const { employees, addEmployee, deleteEmployee } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '', role: '', department: '', email: '', status: 'Active', salary: 0, performance: 3.0
  });

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployee.name && newEmployee.email) {
      addEmployee({
        ...newEmployee as any,
        joinDate: new Date().toISOString().split('T')[0],
      });
      setIsAdding(false);
      setNewEmployee({ name: '', role: '', department: '', email: '', status: 'Active', salary: 0, performance: 3.0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input required placeholder="Name" className="p-2 border rounded" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} />
              <input required placeholder="Email" className="p-2 border rounded" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} />
              <input required placeholder="Role" className="p-2 border rounded" value={newEmployee.role} onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} />
              <input required placeholder="Department" className="p-2 border rounded" value={newEmployee.department} onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })} />
              <input required type="number" placeholder="Salary" className="p-2 border rounded" value={newEmployee.salary || ''} onChange={e => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })} />
              <select className="p-2 border rounded" value={newEmployee.status} onChange={e => setNewEmployee({ ...newEmployee, status: e.target.value as any })}>
                <option value="Active">Active</option>
                <option value="Remote">Remote</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save Employee</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <motion.div
            layout
            key={employee.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => deleteEmployee(employee.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {employee.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{employee.name}</h3>
                <p className="text-sm text-slate-500">{employee.role}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {employee.department}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                {employee.email}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Joined {employee.joinDate}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs font-medium 
                ${employee.status === 'Active' ? 'bg-green-100 text-green-700' :
                  employee.status === 'Remote' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'}`}>
                {employee.status}
              </span>
              <span className="text-xs font-bold text-slate-400">Perf: {employee.performance}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
