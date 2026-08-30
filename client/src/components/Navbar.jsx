import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // LocalStorage-ல் இருக்கும் யூசர் விவரங்களை எடுக்கிறது
  const finalUser = user || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  const handleDirectLogout = () => {
    try {
      if (logout) {
        logout();
      }
    } catch (e) {
      console.log("Context logout bypassed");
    }

    // 1. மெமரியை சுத்தம் செய்கிறது
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();

    // 2. App-க்கு தெரியப்படுத்த நிகழ்வை தூண்டுகிறது
    window.dispatchEvent(new Event('storage'));

    // 3. லாகின் பக்கத்திற்கு நேரடியாக ரீடைரக்ட் செய்கிறது
    window.location.href = '/';
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xl tracking-wide">
        <GraduationCap size={28} />
        <span>EduPulse</span>
      </div>

      {/* User Actions */}
      {finalUser && (
        <div className="flex items-center space-x-6">
          <span className="text-slate-300 hidden sm:inline">
            Welcome, <b className="text-white font-medium">{finalUser.name || "Karthika"}</b>
          </span>
          <button
            onClick={handleDirectLogout}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-900/60 px-4 py-2 rounded-lg text-slate-300 hover:text-rose-400 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}