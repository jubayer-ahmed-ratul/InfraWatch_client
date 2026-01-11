import React from "react";

const Banner = ({ imageUrl }) => {
  const mainBg = imageUrl || "https://i.ibb.co/hJf2JpvT/infra-Banner.jpg";
  const img1 = "https://i.ibb.co.com/Qj6HN51Y/infrabanner2.avif";
  const img2 = "https://i.ibb.co.com/Ndx53NKt/infra-Banner3.jpg";

  return (
    <section
      className="relative  flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('${mainBg}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMTBIMTB2NDBoNDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC4xIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-10" />

      <div className="relative z-10 w-full">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            <div className="w-full lg:w-1/2 text-white space-y-6 md:space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-snug">
                  Make Your City{" "}
                  <span className="block text-green-300 drop-shadow-lg">Better</span>
                </h1>
                
                <div className="flex flex-wrap gap-3 text-2xl md:text-3xl font-semibold">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text px-2">
                    Report
                  </span>
                  <span className="text-white/80">&</span>
                  <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 text-transparent bg-clip-text px-2">
                    Track
                  </span>
                  <span className="text-white/80">Public Issues</span>
                </div>
              </div>

              <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                Spot damaged roads, broken streetlights, or drainage issues.
                Report instantly & track progress live with{" "}
                <span className="font-semibold text-green-200">InfraWatch!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Report Issue Now
                </button>
                <button className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Track Status
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 max-w-md">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-300">20+</div>
                  <div className="text-sm text-white/70">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-300">24h</div>
                  <div className="text-sm text-white/70">Avg. Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-300">98%</div>
                  <div className="text-sm text-white/70">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="relative w-full max-w-xl">
                <div className="relative w-full h-[400px] md:h-[450px]">
                  <div className="absolute w-4/5 left-0 top-0 transform -rotate-3 transition-transform duration-500 hover:rotate-0">
                    <img
                      src={img1}
                      className="w-full h-[320px] md:h-[350px] object-cover rounded-2xl shadow-2xl ring-4 ring-white/20"
                      alt="Infrastructure improvement example"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
                   
                  </div>

                  <div className="absolute w-4/5 right-0 bottom-0 transform rotate-3 transition-transform duration-500 hover:rotate-0">
                    <img
                      src={img2}
                      className="w-full h-[320px] md:h-[350px] object-cover rounded-2xl shadow-2xl ring-4 ring-green-400/30"
                      alt="Completed infrastructure work"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-2xl" />
                   
                  </div>

                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl" />
                </div>

                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-base-100/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-base-content">Live Updates</span>
                    <span className="text-base-content/60">•</span>
                    <span className="text-sm text-base-content/60">Real-time tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;