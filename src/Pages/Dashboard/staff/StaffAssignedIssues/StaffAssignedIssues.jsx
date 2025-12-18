// Pages/Dashboard/Staff/StaffAssignedIssues.jsx
import React from 'react';

const StaffAssignedIssues = () => {
    const assignedIssues = [
        { id: 1, title: 'Issue 1', status: 'Pending', priority: 'High' },
        { id: 2, title: 'Issue 2', status: 'In Progress', priority: 'Medium' },
        { id: 3, title: 'Issue 3', status: 'Resolved', priority: 'Low' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Assigned Issues</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Issue ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assignedIssues.map((issue) => (
                            <tr key={issue.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{issue.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{issue.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${issue.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                          issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{issue.priority}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                                    <button className="text-green-600 hover:text-green-900">Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffAssignedIssues;