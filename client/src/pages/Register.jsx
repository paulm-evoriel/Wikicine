export default function Register() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form className="grid gap-4">
        <input className="input input-bordered" placeholder="Email" />
        <input type="password" className="input input-bordered" placeholder="Mot de passe" />
        <button className="btn btn-secondary">Créer un compte</button>
      </form>
    </div>
  )
}