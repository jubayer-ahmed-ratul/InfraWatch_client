import { MapPin, Phone, Mail } from 'lucide-react';
import PublicPageWrapper from '../../components/PublicPageWrapper/PublicPageWrapper';

const Contact = () => {

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: [
        "01888888888",
        "01999999999"
      ]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Addresses",
      details: [
        "admin@gmail.com",
        "admin2@gmail.com"
      ]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office Address",
      details: [
        "Auchpara",
        "Tongi, Gazipur"
      ]
    }
  ];

  return (
    <PublicPageWrapper>
      <div className="py-16 bg-base-200 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Contact <span className="text-green-600">Us</span>
            </h1>
            <p className="text-base-content/70 text-lg">
              Need to reach us? You can contact us using the information below.
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-base-100 rounded-xl p-8 border border-base-300 space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-base-content/70">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PublicPageWrapper>
  );
};

export default Contact;
