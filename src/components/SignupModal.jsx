import { useState } from 'react';
import { registerUser } from '../api';

export default function SignupModal({ open, onClose, defaultRole = 'Student', onRequestLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: defaultRole });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!open) return null;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await registerUser(form);
      setResult({ type: 'success', message: 'Registration successful! Please login with your credentials.' });
      console.log('Registered:', data);
    } catch (err) {
      setResult({ type: 'error', message: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <h3>Create your account</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={onSubmit} className="form">
          <div className="field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={update} placeholder="Jane Doe" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={update} placeholder="jane@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={update} placeholder="********" required />
          </div>
          <div className="field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={update}>
              <option>Student</option>
              <option>Teacher</option>
            </select>
          </div>

          {result && (
            <div className={`alert ${result.type === 'error' ? 'alert--error' : 'alert--success'}`}>
              {result.message}
              {result.type !== 'error' && (
                <div style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn--secondary" onClick={() => onRequestLogin && onRequestLogin(form.email)}>Login Now</button>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
