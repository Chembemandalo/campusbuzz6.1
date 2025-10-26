import React from 'react';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Cookie Policy</h1>
        <p className="mt-2 text-center text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 prose prose-indigo lg:prose-lg text-gray-600 mx-auto">
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
          </p>
          
          <h2>3. Types of Cookies We Use</h2>
          <ul>
            <li>
              <strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterward to remember your site preferences when logged out.
            </li>
            <li>
              <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
            </li>
            <li>
              <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page.
            </li>
          </ul>

          <h2>4. Your Choices Regarding Cookies</h2>
          <p>
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
          </p>

          <h2>5. More Information</h2>
          <p>
            Hopefully, that has clarified things for you. As was previously mentioned, if there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
          </p>
          
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, you can contact us at cookies@campusbuzz.site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
