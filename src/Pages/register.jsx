import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp, useAuth } from '@clerk/clerk-react';
import PhoneVerification from "../Components/PhoneVerification"; // Ensure this component exists

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      navigate('/');
    }
  }, [authLoaded, isSignedIn, navigate]);

  // Step 1: Validate and move to phone verification
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    setError(""); // Clear previous errors
    setStep(2); // Move to phone verification
    setLoading(false);
  };

  // Step 2: Handle phone verification and register the user
  const handlePhoneVerificationComplete = async () => {
    setPhoneVerified(true);
    setLoading(true);
    
    try {
      if (!signUpLoaded) return;
      
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        phoneNumber: phone,
      });

      if (result.status === 'complete') {
        // Navigation will be handled by the useEffect hook
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (!signUpLoaded) return;
      
      const result = await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
      
      // The redirect will handle the authentication flow
    } catch (error) {
      console.error("Google registration error:", error);
      setError("Google sign-up failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Left Section */}
      <div className="flex-[0.4] hidden md:block">
        <img
          src="images/signup.jpg"
          alt="Register background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="flex-[0.6] p-10 flex flex-col justify-center">
        <div className="flex justify-between mb-5">
          <Link to="/" className="text-gray-400 hover:text-yellow-400 transition duration-300">
            ← Back to Home
          </Link>
          <Link to="/login" className="text-gray-400 hover:text-yellow-400 transition duration-300">
            Login Now
          </Link>
        </div>

        <div className="max-w-lg w-full mx-auto">
          <h2 className="text-2xl font-semibold mb-2 text-center text-white">
            Bring Your Stories to Life
          </h2>
          <p className="text-gray-400 mb-7 text-center">Register Today</p>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {step === 1 ? (
            // Step 1: Registration Form
            <form onSubmit={handleInitialSubmit} className="space-y-5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                required
                disabled={loading}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                required
                disabled={loading}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                required
                disabled={loading}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  required
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-3 text-sm text-gray-400 cursor-pointer hover:text-yellow-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  required
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-3 text-sm text-gray-400 cursor-pointer hover:text-yellow-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "HIDE" : "SHOW"}
                </span>
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg transition duration-300 hover:from-blue-800 hover:to-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue to Phone Verification"}
              </button>

              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full p-3 bg-white text-gray-800 rounded-lg transition duration-300 hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                <img src="/images/google-icon.webp" alt="Google" className="w-5 h-5" />
                {loading ? "Processing..." : "Sign up with Google"}
              </button>
            </form>
          ) : (
            // Step 2: Phone Verification
            <PhoneVerification
              phoneNumber={phone}
              userData={{ name, email, phone }}
              onComplete={handlePhoneVerificationComplete}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;