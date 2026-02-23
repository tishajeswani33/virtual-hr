import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Remote';
  joinDate: string;
  salary: number;
  performance: number; // 1-5
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  score: number;
  email: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface HRContextType {
  employees: Employee[];
  candidates: Candidate[];
  messages: Message[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  updateCandidate: (id: string, data: Partial<Candidate>) => void;
  moveCandidateStage: (id: string, stage: Candidate['stage']) => void;
  sendMessage: (text: string) => void;
  stats: {
    totalEmployees: number;
    openPositions: number;
    activeCandidates: number;
    avgPerformance: number;
  };
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Johnson', role: 'Senior Developer', department: 'Engineering', email: 'alice@company.com', status: 'Active', joinDate: '2021-03-15', salary: 120000, performance: 4.8 },
  { id: '2', name: 'Bob Smith', role: 'Product Manager', department: 'Product', email: 'bob@company.com', status: 'Remote', joinDate: '2020-06-10', salary: 115000, performance: 4.5 },
  { id: '3', name: 'Charlie Davis', role: 'UX Designer', department: 'Design', email: 'charlie@company.com', status: 'On Leave', joinDate: '2022-01-20', salary: 95000, performance: 4.2 },
  { id: '4', name: 'Diana Prince', role: 'HR Specialist', department: 'HR', email: 'diana@company.com', status: 'Active', joinDate: '2019-11-05', salary: 85000, performance: 4.9 },
  { id: '5', name: 'Evan Wright', role: 'Frontend Dev', department: 'Engineering', email: 'evan@company.com', status: 'Active', joinDate: '2023-02-14', salary: 90000, performance: 4.0 },
];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: '101', name: 'Frank Miller', role: 'Senior Developer', stage: 'Interview', score: 85, email: 'frank@example.com' },
  { id: '102', name: 'Grace Hoppers', role: 'Data Scientist', stage: 'Applied', score: 0, email: 'grace@example.com' },
  { id: '103', name: 'Hank Pym', role: 'Product Manager', stage: 'Offer', score: 92, email: 'hank@example.com' },
];

export const HRProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', sender: 'ai', text: 'Hello! I am your AI HR Assistant. Ask me about employee stats, policies, or candidates.', timestamp: new Date() }
  ]);

  // AI Logic
  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let responseText = "I'm not sure about that. Try asking about employee counts, departments, or specific candidates.";

    if (lowerQuery.includes('how many employees') || lowerQuery.includes('count')) {
      responseText = `We currently have ${employees.length} active employees across ${new Set(employees.map(e => e.department)).size} departments.`;
    } else if (lowerQuery.includes('salary') || lowerQuery.includes('paid')) {
      const avgSalary = Math.round(employees.reduce((acc, curr) => acc + curr.salary, 0) / employees.length);
      responseText = `The average salary in the company is $${avgSalary.toLocaleString()}.`;
    } else if (lowerQuery.includes('policy') || lowerQuery.includes('leave')) {
      responseText = "Our standard leave policy allows for 20 days of PTO per year. Remote work is supported for most engineering and product roles.";
    } else if (lowerQuery.includes('hiring') || lowerQuery.includes('candidates')) {
      responseText = `We have ${candidates.length} active candidates in the pipeline. ${candidates.filter(c => c.stage === 'Offer').length} offer(s) are currently out.`;
    } else if (lowerQuery.includes('performance')) {
      const topPerformer = employees.reduce((prev, current) => (prev.performance > current.performance) ? prev : current);
      responseText = `The average performance score is ${(employees.reduce((acc, curr) => acc + curr.performance, 0) / employees.length).toFixed(1)}. Our top performer is ${topPerformer.name}.`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: responseText, timestamp: new Date() }]);
    }, 800);
  };

  const sendMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() }]);
    generateAIResponse(text);
  };

  const addEmployee = (data: Omit<Employee, 'id'>) => {
    const newEmployee = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...data } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const addCandidate = (data: Omit<Candidate, 'id'>) => {
    const newCandidate = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setCandidates(prev => [...prev, newCandidate]);
  };

  const updateCandidate = (id: string, data: Partial<Candidate>) => {
    setCandidates(prev => prev.map(cand => cand.id === id ? { ...cand, ...data } : cand));
  };

  const moveCandidateStage = (id: string, stage: Candidate['stage']) => {
    updateCandidate(id, { stage });
  };

  const stats = {
    totalEmployees: employees.length,
    openPositions: 12, // Mocked
    activeCandidates: candidates.length,
    avgPerformance: Number((employees.reduce((acc, curr) => acc + curr.performance, 0) / employees.length).toFixed(1)),
  };

  return (
    <HRContext.Provider value={{
      employees, candidates, messages,
      addEmployee, updateEmployee, deleteEmployee,
      addCandidate, updateCandidate, moveCandidateStage,
      sendMessage, stats
    }}>
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (context === undefined) {
    throw new Error('useHR must be used within a HRProvider');
  }
  return context;
};
