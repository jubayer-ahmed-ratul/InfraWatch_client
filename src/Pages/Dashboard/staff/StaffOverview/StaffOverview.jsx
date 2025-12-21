import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const StaffOverview = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    assigned: 0,
    resolved: 0,
    pending: 0,
    today: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchStaffIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosSecure.get(
          `/issues/assigned/email/${encodeURIComponent(user.email)}`
        );

        const issues = res.data?.issues || [];

        const resolved = issues.filter(
          (i) => i.status?.toLowerCase() === "resolved"
        ).length;

        const pending = issues.filter((i) =>
          ["pending", "in progress"].includes(i.status?.toLowerCase())
        ).length;

        const assigned = issues.length;

        const today = issues.filter((i) => {
          if (!i.assignedAt) return false;
          const d = new Date(i.assignedAt);
          const n = new Date();
          return (
            d.getDate() === n.getDate() &&
            d.getMonth() === n.getMonth() &&
            d.getFullYear() === n.getFullYear()
          );
        }).length;

        setStats({ assigned, resolved, pending, today });
      } catch (err) {
        console.error("Failed to fetch staff issues:", err);
        setError("Failed to fetch staff issues");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffIssues();
  }, [user?.email, axiosSecure]);

  if (!user) return <p className="p-6">No staff logged in.</p>;
  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const chartData = [
    { name: "Resolved", value: stats.resolved },
    { name: "Pending", value: stats.pending },
    {
      name: "Others",
      value: Math.max(
        stats.assigned - stats.resolved - stats.pending,
        0
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Assigned Issues" value={stats.assigned} />
        <StatCard title="Resolved Issues" value={stats.resolved} />
        <StatCard title="Pending Issues" value={stats.pending} />
        <StatCard title="Today's Tasks" value={stats.today} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Issue Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
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

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default StaffOverview;
