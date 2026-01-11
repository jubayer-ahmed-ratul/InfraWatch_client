import React from 'react';
import { CheckCircle, Users, Shield, Zap, BarChart, Headphones } from 'lucide-react';
import PublicPageWrapper from '../../components/PublicPageWrapper/PublicPageWrapper';

const Services = () => {
  const services = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Issue Reporting & Tracking",
      description: "Easy-to-use platform for reporting infrastructure issues with real-time status tracking and photo uploads.",
      features: ["Photo & location capture", "Real-time status updates", "Priority classification", "Mobile-friendly interface"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Engagement",
      description: "Connect citizens with local government through transparent communication and collaborative problem-solving.",
      features: ["Public issue visibility", "Community voting", "Progress notifications", "Feedback system"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Government Dashboard",
      description: "Comprehensive admin panel for government staff to manage, assign, and resolve reported issues efficiently.",
      features: ["Staff assignment system", "Workflow management", "Performance analytics", "Bulk operations"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Workflows",
      description: "Smart automation to streamline issue processing, notifications, and status updates for faster resolution.",
      features: ["Auto-categorization", "Smart notifications", "Escalation rules", "Integration APIs"]
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description: "Detailed insights and reports on issue trends, resolution times, and community engagement metrics.",
      features: ["Performance dashboards", "Trend analysis", "Custom reports", "Data export"]
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support and customer service to ensure smooth platform operation.",
      features: ["Live chat support", "Email assistance", "Phone support", "Training resources"]
    }
  ];

  

  return (
    <PublicPageWrapper>
      <div className="py-16 bg-base-200 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
              Our <span className="text-green-600">Services</span>
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Comprehensive infrastructure management solutions designed to connect citizens 
              with local government for faster, more transparent issue resolution.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <div key={index} className="bg-base-100 rounded-xl p-6 border border-base-300 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-base-content mb-3">{service.title}</h3>
                <p className="text-base-content/70 mb-4 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-base-content/70">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

       

         
        </div>
      </div>
    </PublicPageWrapper>
  );
};

export default Services;