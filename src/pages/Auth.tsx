import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { createUserProfile, getUserProfile } from '../lib/services';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Create Firestore profile
        await createUserProfile(userCredential.user.uid, {
          displayName: name,
          email: email,
          role: role
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Check if profile exists, if not create one
      const existingProfile = await getUserProfile(result.user.uid);
      if (!existingProfile) {
        await createUserProfile(result.user.uid, {
          displayName: result.user.displayName || '',
          email: result.user.email || '',
          role: UserRole.CUSTOMER
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Sign in to access your Al Fahad Traders account' : 'Join our premium marketplace today'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                  
                  <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setRole(UserRole.CUSTOMER)}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === UserRole.CUSTOMER ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole(UserRole.RESELLER)}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === UserRole.RESELLER ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Reseller
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold px-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black text-gray-400">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center space-x-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Google Account</span>
          </button>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
