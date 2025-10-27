import React, { useState } from 'react';
import { GoogleIcon, SpinnerIcon, AcademicCapIcon, BookOpenIcon, NewspaperIcon, XMarkIcon, ChatBubbleIcon, UsersIcon } from '../components/icons';
import { Page } from '../types';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean, message: string }>;
  onSignUp: (userData: any) => Promise<{ success: boolean, message: string }>;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

// Decorative Panel for the left side
const DecorativePanel = () => (
  <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white p-12 flex-col justify-center relative overflow-hidden">
    <div className="absolute top-20 -left-10 w-32 h-32 text-white/20 animate-float-1">
      <AcademicCapIcon />
    </div>
    <div className="absolute bottom-1/4 right-0 w-40 h-40 text-white/10 animate-float-2">
      <BookOpenIcon />
    </div>
    <div className="absolute bottom-10 left-1/4 w-24 h-24 text-white/15 animate-float-3">
      <NewspaperIcon />
    </div>
    <div className="absolute top-1/4 -right-12 w-48 h-48 text-white/10 animate-float-4">
      <UsersIcon />
    </div>
    <div className="absolute bottom-5 right-1/3 w-28 h-28 text-white/15 animate-float-5">
      <ChatBubbleIcon />
    </div>

    <div className="relative z-10">
      <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome to Campus Buzz</h2>
      <p className="text-blue-200">Your one-stop destination for everything happening at Rockview University. Connect, learn, and grow with your community.</p>
    </div>
  </div>
);

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSuccess = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onNavigate('home');
    }, 500); // Duration of the fade-out animation
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        <button 
            onClick={onBack} 
            className="absolute top-6 right-6 z-20 text-gray-500 bg-white/50 rounded-full p-2 hover:text-gray-800 hover:bg-white/80 transition-colors"
            aria-label="Back to home"
        >
            <XMarkIcon className="w-6 h-6" />
        </button>
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex glass-container rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          <DecorativePanel />
          {/* Form Container */}
          <div className="w-full md:w-1/2 p-8 sm:p-12">
            <h1 className="font-bold text-3xl text-gray-800 mb-2">Campus Buzz</h1>
            <p className="text-gray-600 mb-8">{activeTab === 'login' ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}</p>
            
            <div className="flex border-b border-gray-300 mb-6">
                <AuthTabButton label="Sign In" isActive={activeTab === 'login'} onClick={() => setActiveTab('login')} />
                <AuthTabButton label="Register" isActive={activeTab === 'signup'} onClick={() => setActiveTab('signup')} />
            </div>

            {activeTab === 'login' ? <LoginForm onLogin={onLogin} onNavigate={onNavigate} onSuccess={handleSuccess} /> : <SignUpForm onSignUp={onSignUp} onNavigate={onNavigate} onSuccess={handleSuccess} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthTabButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 border-b-2 ${isActive ? 'border-indigo-500 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
  >
    {label}
  </button>
);


const LoginForm: React.FC<{onLogin: AuthPageProps['onLogin'], onNavigate: AuthPageProps['onNavigate'], onSuccess: () => void}> = ({ onLogin, onNavigate, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await onLogin(email, password);
    setIsLoading(false);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(onSuccess, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative">
      {isSuccess && (
        <div className="absolute inset-0 bg-white/95 z-10 flex flex-col justify-center items-center rounded-lg animate-fade-in">
          <svg className="w-24 h-24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle
              className="animate-checkmark-circle"
              cx="16" cy="16" r="15"
              fill="none" stroke="#4ade80" strokeWidth="2"
            />
            <path
              className="animate-checkmark-tick"
              fill="none" stroke="#4ade80" strokeWidth="3" d="M9 16l5 5 9-9"
            />
          </svg>
          <p className="mt-4 text-xl font-semibold text-gray-700">Success!</p>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      )}

      <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
        <GoogleIcon className="w-5 h-5 mr-3" />
        Sign in with Google
      </button>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="email" placeholder="Your E-mail" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center text-gray-600">
            <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span className="ml-2">Keep me signed in</span>
          </label>
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800">Forgot Password?</a>
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex justify-center items-center">
          {isLoading ? <SpinnerIcon /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

const SignUpForm: React.FC<{onSignUp: AuthPageProps['onSignUp'], onNavigate: AuthPageProps['onNavigate'], onSuccess: () => void}> = ({ onSignUp, onNavigate, onSuccess }) => {
    const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        // Step 2
        department: 'Computer Science',
        major: '',
        yearOfStudy: '1st Year',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!agreed) {
            setError('You must accept the terms and conditions.');
            return;
        }
        setError('');
        setIsLoading(true);
        const result = await onSignUp(formData);
        setIsLoading(false);
        if(result.success){
            setIsSuccess(true);
            setTimeout(onSuccess, 1500);
        } else {
            setError(result.message);
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError("Please fill out all fields in this step.");
            return;
        }
        setError('');
        setRegistrationStep(2);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

  return (
    <div className="relative overflow-hidden">
        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col justify-center items-center rounded-lg animate-fade-in">
            <svg className="w-24 h-24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle className="animate-checkmark-circle" cx="16" cy="16" r="15" fill="none" stroke="#4ade80" strokeWidth="2" />
              <path className="animate-checkmark-tick" fill="none" stroke="#4ade80" strokeWidth="3" d="M9 16l5 5 9-9" />
            </svg>
            <p className="mt-4 text-xl font-semibold text-gray-700">Account Created!</p>
            <p className="text-gray-500">Redirecting...</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
            <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(registrationStep - 1) * 100}%)` }}
            >
                {/* Step 1 */}
                <div className="w-full flex-shrink-0">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:space-x-4">
                            <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 sm:mb-0" />
                            <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <input type="email" name="email" placeholder="E-mail" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="password" name="password" placeholder="Type Password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        {error && registrationStep === 1 && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <button onClick={handleNextStep} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                            Next
                        </button>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="w-full flex-shrink-0 pl-4">
                    <div className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <select name="department" value={formData.department} required onChange={handleChange} className="w-full px-4 py-3 mt-1 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>Computer Science</option>
                                <option>Engineering</option>
                                <option>Arts & Humanities</option>
                                <option>Biology</option>
                                <option>Business</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700">Major</label>
                            <input type="text" name="major" placeholder="e.g., Artificial Intelligence" required value={formData.major} onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700">Year of Study</label>
                            <select name="yearOfStudy" value={formData.yearOfStudy} required onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                                <option>Graduate</option>
                                <option>Staff</option>
                            </select>
                        </div>

                        {error && registrationStep === 2 && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <div className="text-sm">
                            <label className="flex items-center text-gray-600">
                                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">I accept the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800">Terms and Conditions</a></span>
                            </label>
                        </div>
                        <div className="flex space-x-4">
                            <button type="button" onClick={() => setRegistrationStep(1)} className="w-1/3 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                                Back
                            </button>
                            <button type="submit" disabled={isLoading} className="w-2/3 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex justify-center items-center">
                                {isLoading ? <SpinnerIcon /> : 'Sign Up'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
  );
};


export default AuthPage;