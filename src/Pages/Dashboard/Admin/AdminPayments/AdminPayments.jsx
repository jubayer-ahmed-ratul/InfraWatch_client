import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/payments/total");
      setTotal(res.data.total);
      setCount(res.data.count);
    } catch (err) {
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Payments</h1>
      <div className="bg-white shadow rounded p-4">
        <p className="text-lg">Total Successful Payments: <strong>{count}</strong></p>
        <p className="text-lg">Total Amount Collected: <strong>{total} BDT</strong></p>
      </div>
    </div>
  );
};

export default AdminPayments;
