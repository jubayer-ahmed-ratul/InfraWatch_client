import React from "react";

const stepsData = [
  {
    id: 1,
    title: "Report an Issue",
    description:
      "Submit an issue quickly with photos, description, and location.",
  },
  {
    id: 2,
    title: "Staff Assignment",
    description:
      "City staff are assigned to investigate and resolve the issue.",
  },
  {
    id: 3,
    title: "Track Progress",
    description:
      "Monitor the issue status from pending to resolved in real-time.",
  },
  {
    id: 4,
    title: "Issue Resolved",
    description:
      "Receive notification when the issue is fixed and view detailed report.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-11/12 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How <span className="text-green-600">It Works</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
          Follow these simple steps to report city issues and track their
          resolution easily.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stepsData.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white text-2xl font-bold mb-4 shadow-lg">
                {step.id}
              </div>

              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

              <p className="text-gray-500 text-sm max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
