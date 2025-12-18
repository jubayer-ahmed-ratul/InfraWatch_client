// Pages/Dashboard/Staff/StaffOverview.jsx
import React from 'react';

const StaffOverview = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Assigned Issues</h3>
                    <p className="text-3xl font-bold mt-2">15</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Resolved Issues</h3>
                    <p className="text-3xl font-bold mt-2">8</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Pending Issues</h3>
                    <p className="text-3xl font-bold mt-2">7</p>
                </div>
            </div>
        </div>
    );
};

export default StaffOverview;