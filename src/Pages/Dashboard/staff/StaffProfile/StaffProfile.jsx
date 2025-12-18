// Pages/Dashboard/Staff/StaffProfile.jsx
import React from 'react';

const StaffProfile = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">
                        JD
                    </div>
                    <div className="ml-6">
                        <h2 className="text-xl font-bold">John Doe</h2>
                        <p className="text-gray-600">Staff Member</p>
                        <p className="text-sm text-gray-500">john.doe@example.com</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            type="text" 
                            value="John Doe"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value="john.doe@example.com"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input 
                            type="text" 
                            value="+1234567890"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input 
                            type="text" 
                            value="Technical Support"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            readOnly
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;