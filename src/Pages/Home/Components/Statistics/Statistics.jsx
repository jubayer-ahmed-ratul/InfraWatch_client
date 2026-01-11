const Statistics = () => {
  const stats = [
    {
      number: "15+",
      label: "Issues Reported",
      icon: "📋",
      bgColor: "bg-blue-500"
    },
    {
      number: "6+", 
      label: "Issues Resolved",
      icon: "✅",
      bgColor: "bg-green-500"
    },
    {
      number: "5+",
      label: "Active Staff Members",
      icon: "👷",
      bgColor: "bg-purple-500"
    },
    {
      number: "98%",
      label: "Citizen Satisfaction",
      icon: "😊",
      bgColor: "bg-yellow-500"
    }
  ];

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Our <span className="text-green-600">Impact</span> in Numbers
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            See how InfraWatch is making a real difference in our community through transparent issue reporting and resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${stat.bgColor} flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-base-content mb-2 group-hover:text-green-600 transition-colors">
                {stat.number}
              </div>
              <div className="text-base-content/70 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default Statistics;