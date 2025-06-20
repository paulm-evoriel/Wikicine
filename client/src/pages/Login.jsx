export default function Login() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form className="grid gap-4">
        <input className="input input-bordered" placeholder="Email" />
        <input type="password" className="input input-bordered" placeholder="Mot de passe" />
        <button className="btn btn-primary">Se connecter</button>
      </form>
    </div>
  )
}