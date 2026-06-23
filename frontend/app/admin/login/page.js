'use client'
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

function LoginLogic({ setSuccess }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('logout') === 'success') {
      setSuccess('Successfully logged out.');
      router.replace('/admin/login');
    }
  }, [searchParams, router, setSuccess]);

  return null;
}

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Pastor');
  const [formData, setFormData] = useState({
    fullName: '',
    identifier: '', // email or mobile for login
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api';

  // Password strength logic
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, color: 'transparent', label: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    
    if (score <= 2) return { score, color: '#f44336', label: 'Weak' }; // Red
    if (score <= 4) return { score, color: '#ffeb3b', label: 'Fair' }; // Yellow
    return { score, color: '#4caf50', label: 'Strong' }; // Green
  };

  const passStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
      if (passStrength.score < 5) {
        setError("Password must be 8+ characters, with an uppercase, lowercase, number, and symbol.");
        setIsLoading(false);
        return;
      }
    }

    const endpoint = isLogin ? '/auth.php?action=login' : '/auth.php?action=register';
    const payload = isLogin ? {
      identifier: formData.identifier,
      password: formData.password
    } : {
      full_name: formData.fullName,
      designation: role,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password
    };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          if (data.user.designation !== role) {
            setError(`Error: Account found, but you are not registered as a ${role}.`);
            return;
          }
          login(data.user, data.token);
          router.push('/admin');
        } else {
          setSuccess('Registration successful! You can now login.');
          setTimeout(() => {
            setIsLogin(true);
            setFormData({...formData, password: '', confirmPassword: ''});
          }, 2000);
        }
      } else {
        setError(data.error || 'Request failed');
      }
    } catch (err) {
      setError('Network error. Ensure API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    setSuccess('');
  };

  const roles = ['Pastor', 'Secretary', 'Developer'];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      padding: '120px 1rem 2rem 1rem', // Clears the navbar safely
      boxSizing: 'border-box'
    }}>
      <Suspense fallback={null}>
        <LoginLogic setSuccess={setSuccess} />
      </Suspense>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '500px',
          margin: 'auto', // This ensures perfect vertical/horizontal centering without cutoff
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--color-primary)', opacity: '0.05', borderRadius: '50%' }} />
        
        <motion.h2 
          layout
          style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            fontSize: '2rem', 
            color: 'var(--color-primary)',
            fontWeight: '700'
          }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </motion.h2>
        
        {/* Role Switcher */}
        <div style={{ 
          display: 'flex', 
          background: '#f1f1f1', 
          borderRadius: '12px', 
          padding: '0.25rem', 
          marginBottom: '2rem',
          position: 'relative'
        }}>
          {roles.map((r) => (
            <button 
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{ 
                flex: 1,
                padding: '0.75rem 0', 
                border: 'none',
                background: 'transparent',
                color: role === r ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.3s ease'
              }}
            >
              {role === r && (
                <motion.div 
                  layoutId="roleTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'var(--color-primary)',
                    borderRadius: '8px',
                    zIndex: -1,
                    boxShadow: '0 4px 12px rgba(139,0,0,0.2)'
                  }}
                />
              )}
              {r}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="errorMsg"
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#d32f2f', background: '#ffebee', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              key="successMsg"
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#2e7d32', background: '#e8f5e9', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div 
                key="fullNameField"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <input 
                  type="text" placeholder="Full Name" required={!isLogin} 
                  value={formData.fullName} 
                  onChange={e => setFormData({...formData, fullName: e.target.value})} 
                  style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </motion.div>
            )}

            {isLogin ? (
              <motion.div 
                key="identifier"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <input 
                  type="text" placeholder="Email or Mobile Number" required={isLogin} 
                  value={formData.identifier} 
                  onChange={e => setFormData({...formData, identifier: e.target.value})} 
                  style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="registerFields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <input 
                  type="email" placeholder="Email Address" required={!isLogin}
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
                <input 
                  type="text" placeholder="Mobile Number" required={!isLogin}
                  value={formData.mobile} 
                  onChange={e => setFormData({...formData, mobile: e.target.value})} 
                  style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </motion.div>
            )}

            <motion.div layout key="passwordField" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                required 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                style={{ width: '100%', padding: '1rem', paddingRight: '3rem', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              
              {!isLogin && (
                <div style={{ marginTop: '0.5rem' }}>
                  {formData.password && (
                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ flex: 1, height: '4px', background: '#ddd', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(passStrength.score / 5) * 100}%`, height: '100%', background: passStrength.color, transition: 'all 0.3s' }} />
                      </div>
                      <span style={{ color: passStrength.color, fontWeight: '600' }}>{passStrength.label}</span>
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#888', lineHeight: '1.4' }}>
                    Password must be at least 8 characters long, and include an uppercase letter, lowercase letter, number, and symbol.
                  </div>
                </div>
              )}
            </motion.div>

            {!isLogin && (
              <motion.div 
                key="confirmPasswordField"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'relative' }}
              >
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="Confirm Password" 
                  required={!isLogin} 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  style={{ width: '100%', padding: '1rem', paddingRight: '3rem', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            type="submit" 
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              fontWeight: '700',
              fontSize: '1.1rem',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(139,0,0,0.3)',
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'Processing...' : (isLogin ? `Login as ${role}` : `Register as ${role}`)}
          </motion.button>
        </form>


      </motion.div>
    </div>
  );
}
