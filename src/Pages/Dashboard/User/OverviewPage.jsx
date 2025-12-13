import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Card } from "../Card/Card";
import { AlertCircle, Clock, TrendingUp, CheckCircle, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const DashboardPage = () => {
  const axiosSecure = useAxiosSecure();
  const [issueStats, setIssueStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [payments, setPayments] = useState(0); 
  const [monthlyData, setMonthlyData] = useState([]);
  const [issueData, setIssueData] = useState([]);

  // Normalize status for consistent counting
  const normalizeStatus = (status) => status.toLowerCase().replace(/[-_\s]/g, "");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axiosSecure.get("/issues?limit=1000"); 
        const issues = res.data.issues || [];

        const total = issues.length;
        const pending = issues.filter(i => normalizeStatus(i.status) === "pending").length;
        const inProgress = issues.filter(i => normalizeStatus(i.status) === "inprogress").length;
        const resolved = issues.filter(i => normalizeStatus(i.status) === "resolved").length;

        setIssueStats({ total, pending, inProgress, resolved });

        // Monthly summary (example / placeholder)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const monthlySummary = months.map((month, idx) => ({
          month,
          issues: Math.floor(Math.random() * 50) + 20, 
          resolved: Math.floor(Math.random() * 30) + 10
        }));
        setMonthlyData(monthlySummary);

        // Pie chart data
        setIssueData([
          { name: "Pending", value: pending },
          { name: "In Progress", value: inProgress },
          { name: "Resolved", value: resolved },
        ]);

      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };

    fetchIssues();
  }, [axiosSecure]);

  const pieColors = ['#f59e0b', '#3b82f6', '#10b981'];

  const cardConfigs = [
    { title: 'Total issues submitted', value: issueStats.total, icon: <AlertCircle />, color: 'from-blue-500 to-cyan-500', trend: '+12%' },
    { title: 'Total pending issues', value: issueStats.pending, icon: <Clock />, color: 'from-amber-500 to-orange-500', trend: '-5%' },
    { title: 'Total in progress issues', value: issueStats.inProgress, icon: <TrendingUp />, color: 'from-violet-500 to-purple-600', trend: '+8%' },
    { title: 'Total resolved issues', value: issueStats.resolved, icon: <CheckCircle />, color: 'from-green-500 to-emerald-600', trend: '+15%' },
    { title: 'Total payments', value: `$${payments.toLocaleString()}`, icon: <DollarSign />, color: 'from-emerald-500 to-teal-600', trend: '+22%' },
  ];

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">Issues: {payload[0].value}</p>
          <p className="text-green-600">Resolved: {payload[1]?.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Overview</span>
        </h1>
        <p className="text-gray-600">Summary of your issues and payments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cardConfigs.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Issues Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} axisLine={false} />
                <YAxis tick={{ fill: '#6b7280' }} axisLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar dataKey="issues" name="Total Issues" radius={[8, 8, 0, 0]} fill="#3b82f6" />
                <Bar dataKey="resolved" name="Resolved Issues" radius={[8, 8, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Issue Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {issueData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} issues`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
