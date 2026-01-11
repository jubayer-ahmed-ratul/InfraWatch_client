import PublicPageWrapper from '../../components/PublicPageWrapper/PublicPageWrapper';

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Project Director",
      image: "https://i.pravatar.cc/150?img=1",
      description: "Leading digital governance initiatives for 8+ years"
    },
    {
      name: "Michael Chen", 
      role: "Technical Lead",
      image: "https://i.pravatar.cc/150?img=2",
      description: "Full-stack developer passionate about civic technology"
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      image: "https://i.pravatar.cc/150?img=3", 
      description: "Connecting citizens with local government for 5+ years"
    }
  ];

  return (
    <PublicPageWrapper>
      <div className="py-16 bg-base-200 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
              About <span className="text-green-600">InfraWatch</span>
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              We're building a bridge between citizens and local government through transparent, 
              efficient infrastructure issue reporting and resolution.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-base-100 rounded-xl p-8 border border-base-300">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-base-content mb-4">Our Mission</h2>
              <p className="text-base-content/70 leading-relaxed">
                To empower citizens with a transparent, efficient platform for reporting infrastructure 
                issues and tracking their resolution, fostering better communication between communities 
                and local government.
              </p>
            </div>

            <div className="bg-base-100 rounded-xl p-8 border border-base-300">
              <div className="text-4xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-base-content mb-4">Our Vision</h2>
              <p className="text-base-content/70 leading-relaxed">
                A world where every citizen has a voice in improving their community, and where 
                local governments can respond quickly and effectively to infrastructure challenges 
                through digital innovation.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-base-100 rounded-xl p-8 mb-16 border border-base-300">
            <h2 className="text-3xl font-bold text-base-content mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-base-content/70">
              <p className="mb-4">
                InfraWatch was born from a simple frustration: reporting infrastructure problems 
                was complicated, slow, and often led nowhere. Citizens had no way to track progress, 
                and local governments struggled with inefficient reporting systems.
              </p>
              <p className="mb-4">
                In 2023, our team of civic technology enthusiasts decided to change this. We built 
                InfraWatch as a modern, transparent platform that makes it easy for citizens to 
                report issues and for governments to manage and resolve them efficiently.
              </p>
              <p>
                Today, we're proud to serve thousands of citizens and dozens of local government 
                agencies, helping create more responsive and accountable communities.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-base-content mb-12 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-base-100 rounded-xl p-6 text-center border border-base-300 hover:shadow-lg transition-shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-500"
                  />
                  <h3 className="text-xl font-bold text-base-content mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-base-content/70 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-base-100 rounded-xl p-8 border border-base-300">
            <h2 className="text-3xl font-bold text-base-content mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold text-base-content mb-2">Transparency</h3>
                <p className="text-base-content/70 text-sm">Open communication and clear progress tracking</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-base-content mb-2">Efficiency</h3>
                <p className="text-base-content/70 text-sm">Fast, streamlined processes for everyone</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold text-base-content mb-2">Collaboration</h3>
                <p className="text-base-content/70 text-sm">Bringing citizens and government together</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="font-bold text-base-content mb-2">Innovation</h3>
                <p className="text-base-content/70 text-sm">Using technology to solve real problems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicPageWrapper>
  );
};

export default About;