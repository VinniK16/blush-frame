import { useState, useEffect } from "react";
import { Camera, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BlushFrameWelcome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/camera");
  };

  return (
    <div className="fixed inset-0 overflow-hidden min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-indigo-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
        
        {/* Floating Hearts */}
        <div className="absolute top-1/4 left-1/4 text-pink-300 text-2xl animate-bounce">💖</div>
        <div className="absolute top-1/3 right-1/3 text-purple-300 text-xl animate-pulse">✨</div>
        <div className="absolute bottom-1/3 left-1/3 text-indigo-300 text-2xl animate-bounce">🌟</div>
        <div className="absolute top-2/3 right-1/4 text-pink-400 text-xl animate-pulse">💫</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Logo/Brand */}
        <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6 gradient-text">
              BlushFrame
            </h1>
            <div className="absolute -top-4 -right-4 text-yellow-400 text-4xl animate-spin">✨</div>
            <div className="absolute -bottom-2 -left-4 text-pink-400 text-3xl animate-bounce">💕</div>
          </div>
        </div>

        {/* Tagline */}
        <div className={`mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-2xl md:text-3xl text-gray-700 font-medium leading-relaxed">
            Capture memories, create magic ✨
          </p>
        </div>

        {/* CTA Button */}
        <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button
            onClick={handleGetStarted}
            className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-16 py-8 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-pink-600 hover:to-purple-700 pulse-glow"
          >
            <div className="flex items-center space-x-4">
              <Camera className="w-8 h-8" />
              <span>Get Started</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .gradient-text {
          background: linear-gradient(45deg, #ec4899, #8b5cf6, #6366f1);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .pulse-glow {
          box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default BlushFrameWelcome;