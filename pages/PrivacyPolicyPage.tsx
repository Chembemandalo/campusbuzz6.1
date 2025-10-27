import React from 'react';
// FIX: Add BackButton to imports
import { BackButton } from '../components/icons';

// FIX: Add props interface
interface PrivacyPolicyPageProps {
  handleBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ handleBack }) => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* FIX: Add BackButton component */}
        <BackButton onClick={handleBack} className="mb-8" />
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Privacy Policy</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 prose prose-indigo lg:prose-lg text-gray-600 mx-auto">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Campus Buzz. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Campus Buzz, express an interest in obtaining information about us or our products and services, when you participate in activities on the Campus Buzz or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the Campus Buzz, the choices you make and the products and features you use. The personal information we collect may include the following: Name, Email Address, Usernames, Passwords, and other similar data.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our Campus Buzz for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>Request feedback.</li>
            <li>To enable user-to-user communications.</li>
            <li>To manage user accounts.</li>
          </ul>

          <h2>4. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>

          <h2>5. Do We Use Cookies and Other Tracking Technologies?</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
          </p>
          
          <h2>6. How Long Do We Keep Your Information?</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
          </p>

          <h2>7. How Do We Keep Your Information Safe?</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2>8. What Are Your Privacy Rights?</h2>
          <p>
            In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at privacy@campusbuzz.site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
