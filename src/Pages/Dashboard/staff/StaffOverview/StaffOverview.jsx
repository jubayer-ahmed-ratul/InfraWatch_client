import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const StaffOverview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    assigned: 0,
    resolved: 0,
    pending: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.email) {
          setError("User email not found. Cannot fetch issues.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/issues/assigned/email/${encodeURIComponent(user.email)}`
        );

        const issues = response.data.issues || [];

        const resolved = issues.filter(
          (issue) => issue.status.toLowerCase() === "resolved"
        ).length;

        const pending = issues.filter(
          (issue) =>
            issue.status.toLowerCase() === "pending" ||
            issue.status.toLowerCase() === "in progress"
        ).length;

        const assigned = issues.length;

        // Today’s tasks
        const today = issues.filter((issue) => {
          const issueDate = new Date(issue.assignedAt); // Assuming issues have assignedAt field
          const now = new Date();
          return (
            issueDate.getDate() === now.getDate() &&
            issueDate.getMonth() === now.getMonth() &&
            issueDate.getFullYear() === now.getFullYear()
          );
        }).length;

        setStats({ assigned, resolved, pending, today });
      } catch (err) {
        console.error("Failed to fetch staff issues:", err);
        setError("Failed to fetch staff issues. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffIssues();
  }, [user?.email]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!user) return <p className="p-6">No staff logged in.</p>;

  const chartData = [
    { name: "Resolved", value: stats.resolved },
    { name: "Pending", value: stats.pending },
    { name: "Assigned", value: stats.assigned - stats.resolved - stats.pending },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Assigned Issues</h3>
          <p className="text-3xl font-bold mt-2">{stats.assigned}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Resolved Issues</h3>
          <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Pending Issues</h3>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Today's Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.today}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Issue Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffOverview;
