"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  email_verified: number;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="min-h-full bg-black text-white">

      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          AYRAZ ADMIN
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          Users
        </h1>

        <p className="mt-2 text-zinc-500">
          Customers who have signed up to AYRAZ.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">

        {loading ? (
          <div className="p-10 text-center text-zinc-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-zinc-800 bg-zinc-900">
                <tr>
                  <th className="px-6 py-5 text-sm font-medium text-zinc-400">
                    ID
                  </th>

                  <th className="px-6 py-5 text-sm font-medium text-zinc-400">
                    Name
                  </th>

                  <th className="px-6 py-5 text-sm font-medium text-zinc-400">
                    Email
                  </th>

                  <th className="px-6 py-5 text-sm font-medium text-zinc-400">
                    Status
                  </th>

                  <th className="px-6 py-5 text-sm font-medium text-zinc-400">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/50"
                  >

                    <td className="px-6 py-5 text-zinc-500">
                      #{user.id}
                    </td>

                    <td className="px-6 py-5 font-medium">
                      {user.name}
                    </td>

                    <td className="px-6 py-5 text-zinc-400">
                      {user.email}
                    </td>

                    <td className="px-6 py-5">
                      {user.email_verified ? (
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-zinc-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}