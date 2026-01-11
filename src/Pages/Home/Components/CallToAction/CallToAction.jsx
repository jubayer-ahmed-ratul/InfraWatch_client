import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make Your City Better?
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of citizens who are actively improving their communities. 
            Report issues, track progress, and see real change happen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2 text-lg"
          >
           
            Get Started Free
          </button>
          
          <button
            onClick={() => navigate('/allissues')}
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 flex items-center gap-2 text-lg"
          >
            
            View All Issues
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Quick & Easy</h3>
            <p className="text-green-100">Report issues in under 2 minutes</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Updates</h3>
            <p className="text-green-100">Track progress every step of the way</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Proven Results</h3>
            <p className="text-green-100">98% satisfaction rate from users</p>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default CallToAction;