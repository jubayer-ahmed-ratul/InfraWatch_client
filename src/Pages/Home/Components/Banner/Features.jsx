import React from "react";

const featuresData = [
  { id: 1, title: "Report Issues Easily" },
  { id: 2, title: "Track Status" },
  { id: 3, title: "Community Upvotes" },
  { id: 4, title: "Notifications" },
  { id: 5, title: "Staff Assignment" },
  { id: 6, title: "Detailed Reports" },
];

const images = [
  "https://i.ibb.co/rG8PfXHt/feature3.avif",
  "https://i.ibb.co/3yfZwMDB/feature2.avif",
  "https://i.ibb.co/GYBGh6t/feature1.avif",
  "https://i.ibb.co.com/Qj6HN51Y/infrabanner2.avif"
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-11/12 mx-auto  flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={img}
                alt={`Feature ${index + 1}`}
                className="w-full h-48 object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>

        <div className="lg:w-1/2 flex flex-col justify-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Key <span className="text-green-600">Features</span>
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Explore the main functionalities that make reporting and tracking city issues simple and effective.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                className="bg-white shadow-md rounded-xl border border-gray-100 p-4 flex items-center justify-center font-semibold text-gray-800 hover:shadow-xl transition"
              >
                {feature.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
