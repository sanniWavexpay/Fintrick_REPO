// components/common/ErrorPage.jsx
import { AlertTriangle, Home, RefreshCw, Ghost, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage({ type = "404", reset }) {
  const navigate = useNavigate();

  const configs = {
    404: {
      title: "Lost in Space?",
      desc: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
      icon: <Ghost size={80} className="text-zinc-200" />,
      btnText: "Back to Home",
      action: () => navigate("/"),
    },
    crash: {
      title: "Something Went Wrong",
      desc: "An unexpected error occurred. Our team has been notified, and we're working to fix it.",
      icon: <AlertTriangle size={80} className="text-pink-500" />,
      btnText: "Refresh Page",
      action: reset || (() => window.location.reload()),
    },
    network: {
      title: "Connection Lost",
      desc: "We're having trouble connecting to our servers. Please check your internet and try again.",
      icon: <RefreshCw size={80} className="text-blue-500" />,
      btnText: "Retry Connection",
      action: () => window.location.reload(),
    },
    no_data: {
      title: "No Results Found",
      desc: "We couldn't find what you're looking for. Try using different keywords or filters.",
      icon: <Search size={80} className="text-zinc-200" />,
      btnText: "Clear Filters",
      action: () => navigate("/shop"),
    },
  };
  const current = configs[type] || configs["404"];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 animate-bounce">{current.icon}</div>
      <h1 className="text-3xl font-black text-zinc-900 mb-2">{current.title}</h1>
      <p className="text-zinc-500 max-w-sm mb-8">{current.desc}</p>

      <div className="flex gap-4">
        <button onClick={current.action} className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform">
          {current.btnText === "Back to Home" ? <Home size={18} /> : <RefreshCw size={18} />}
          {current.btnText}
        </button>
      </div>
    </div>
  );
}
