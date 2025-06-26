import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login'); // Redirige vers la page de connexion
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  return (
    <div className="p-4 bg-base-100 text-base-content min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
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
        <button className="btn btn-primary" type="submit">S'inscrire</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
} 