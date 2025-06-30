import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MembersPage({ user }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    verified: "all", // all, verified, unverified
    role: "all", // all, admin, user
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des membres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleVerify = async (memberId, verify = true) => {
    if (!user?.is_admin) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/users/${memberId}/${
          verify ? "verify" : "unverify"
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberId ? { ...member, is_verified: verify } : member
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du membre:", error);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesVerified =
      filters.verified === "all" ||
      (filters.verified === "verified" && member.is_verified) ||
      (filters.verified === "unverified" && !member.is_verified);
    const matchesRole =
      filters.role === "all" ||
      (filters.role === "admin" && member.is_admin) ||
      (filters.role === "user" && !member.is_admin);
    return matchesSearch && matchesVerified && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Chargement des membres...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Membres de la communauté
        </h1>

        {/* Filtres et recherche */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="form-control">
            <input
              type="text"
              placeholder="Rechercher un membre..."
              className="input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select select-bordered"
            value={filters.verified}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, verified: e.target.value }))
            }
          >
            <option value="all">Tous les comptes</option>
            <option value="verified">Comptes vérifiés</option>
            <option value="unverified">Comptes non vérifiés</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="user">Utilisateurs</option>
          </select>
        </div>

        {/* Liste des membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        <span className="text-lg">
                          {member.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/account/${member.id}`}
                        className="card-title hover:text-primary"
                      >
                        {member.username}
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.is_verified ? (
                          <span className="badge badge-success">Vérifié</span>
                        ) : (
                          <span className="badge badge-error">Non vérifié</span>
                        )}
                        {member.is_admin && (
                          <span className="badge badge-error">
                            👑 Administrateur
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-base-content/70">
                  <p>
                    Membre depuis{" "}
                    {new Date(member.created_at).toLocaleDateString("fr-FR")}
                  </p>
                  {member.reviews_count && (
                    <p>{member.reviews_count} avis publiés</p>
                  )}
                </div>

                {user?.is_admin && user.id !== member.id && (
                  <div className="card-actions justify-end mt-4">
                    {member.is_verified ? (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleVerify(member.id, false)}
                      >
                        Annuler la vérification
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleVerify(member.id, true)}
                      >
                        Vérifier le compte
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg">Aucun membre ne correspond aux critères.</p>
          </div>
        )}
      </div>
    </div>
  );
}
