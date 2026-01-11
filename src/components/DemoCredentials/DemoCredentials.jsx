import React from 'react';
import { useNavigate } from 'react-router-dom';

const DemoCredentials = () => {
  const navigate = useNavigate();

  const credentials = [
    {
      role: "Admin",
      email: "admin@gmail.com",
      password: "12345678",
      icon: "👑",
      color: "from-purple-500 to-purple-600",
      description: "Full system access, manage users & staff"
    },
    {
      role: "Staff",
      email: "hamimstaff@gmail.com", 
      password: "12345678",
      icon: "👷",
      color: "from-blue-500 to-blue-600",
      description: "Handle assigned issues, update status"
    },
    {
      role: "Citizen",
      email: "usert@gmail.com",
      password: "12345678", 
      icon: "👤",
      color: "from-green-500 to-green-600",
      description: "Report issues, track progress"
    }
  ];

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            🚀 Try <span className="text-green-600">Demo Login</span>
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Experience different user roles with pre-configured demo accounts. No registration required!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {credentials.map((cred, index) => (
            <div key={index} className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${cred.color} flex items-center justify-center text-2xl`}>
                {cred.icon}
              </div>
              
              <h3 className="text-xl font-bold text-center mb-2">{cred.role}</h3>
              <p className="text-sm text-base-content/60 text-center mb-4">{cred.description}</p>
              
              <div className="bg-base-200 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base-content/70">Email:</span>
                  <span className="font-mono text-xs">{cred.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Password:</span>
                  <span className="font-mono text-xs">{cred.password}</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                className={`w-full py-2 px-4 bg-gradient-to-r ${cred.color} text-white rounded-lg hover:opacity-90 transition font-medium`}
              >
                Login as {cred.role}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
            <span>💡</span>
            <span>Click "Login as [Role]" to go to login page, then use the demo buttons for instant access</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoCredentials;