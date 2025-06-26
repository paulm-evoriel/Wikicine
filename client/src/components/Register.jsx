import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RegisterForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <input
        className="input input-bordered"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="input input-bordered"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="input input-bordered"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="input input-bordered"
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">S'inscrire</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
} 