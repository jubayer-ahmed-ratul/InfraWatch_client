import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I report an infrastructure issue?",
      answer: "Simply create an account, click 'Report Issue', fill out the form with details and photos, and submit. Our team will review and assign it to the appropriate staff member."
    },
    {
      question: "How long does it take to resolve an issue?",
      answer: "Resolution time varies by issue type and severity. Minor issues typically take 3-7 days, while major infrastructure problems may take 2-4 weeks. You can track progress in real-time."
    },
    {
      question: "Can I track the status of my reported issue?",
      answer: "Yes! Once you report an issue, you can track its progress through your dashboard. You'll receive updates when the status changes from Pending → In Progress → Working → Resolved."
    },
    {
      question: "What types of issues can I report?",
      answer: "You can report various infrastructure issues including broken streetlights, road damage, garbage collection problems, water supply issues, electrical problems, and public safety concerns."
    },
    {
      question: "Is there a limit to how many issues I can report?",
      answer: "Free users can report up to 3 issues per month. Premium users have unlimited reporting. This helps us manage resources effectively while ensuring quality reports."
    },
    {
      question: "How does the priority system work?",
      answer: "Issues are prioritized based on severity, public safety impact, and community votes. Emergency issues (safety hazards) get immediate attention, while routine maintenance follows standard timelines."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Frequently Asked <span className="text-green-600">Questions</span>
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto text-lg">
            Got questions? We've got answers. Find everything you need to know about using InfraWatch.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-base-200 rounded-xl overflow-hidden border border-base-300">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-base-300 transition-colors"
              >
                <span className="font-semibold text-base-content pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-base-content/60 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-base-300 pt-4">
                    <p className="text-base-content/70 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-base-100 rounded-xl p-6 border border-base-300">
            <h3 className="text-xl font-bold text-base-content mb-2">Still have questions?</h3>
            <p className="text-base-content/70 mb-4">Can't find the answer you're looking for? Our support team is here to help.</p>
            <button  className="btn bg-green-600 hover:bg-green-700 text-white border-none">
             <a href="/contact">Contact Support</a> 
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;