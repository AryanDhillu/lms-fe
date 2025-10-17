import { useState } from 'react';
import { loginUser } from '../api';

export default function LoginModal({ open, onClose, onLoggedIn, defaultEmail = '' }) {
  const [form, setForm] = useState({ email: defaultEmail, password: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!open) return null;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await loginUser(form);
      setResult({ type: 'success', message: 'Logged in successfully!' });
      onLoggedIn && onLoggedIn(data);
      // Close slightly after showing success
      setTimeout(onClose, 600);
    } catch (err) {
      setResult({ type: 'error', message: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <h3>Login</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={onSubmit} className="form">
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={update} placeholder="********" required />
          </div>

          {result && (
            <div className={`alert ${result.type === 'error' ? 'alert--error' : 'alert--success'}`}>
              {result.message}
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
