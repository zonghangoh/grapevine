import { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { authFetch } from '../utils/authFetch';
import { Paginator } from '../components/shared/Paginator';

interface User {
  id: number;
  username: string;
  admin: boolean;
}

interface PaginatedResponse {
  users: User[];
  total: number;
  totalPages: number;
}

const AccountsPage = () => {
  const { isAuthenticated, isAdmin, userId } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    const response: PaginatedResponse = await authFetch(`/users?page=${currentPage}`);
    setUsers(response.users);
    setTotalPages(response.totalPages);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    await authFetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });

    setNewUsername('');
    setNewPassword('');
    fetchUsers();
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    await authFetch(`/users/${editingUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: editUsername || undefined,
        password: editPassword || undefined 
      }),
    });

    setEditingUser(null);
    setEditPassword('');
    setEditUsername('');
    fetchUsers();
  };

  const handleDeleteUser = async (userId: number) => {
    await authFetch(`/users/${userId}`, {
      method: 'DELETE'
    });

    setDeletingUser(null);
    fetchUsers();
  };

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <>
    <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link
            to="/files"
            className="text-indigo-600 hover:text-indigo-800">
            &larr; Back to My Files
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-8">Manage User Accounts</h1>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4 max-w-md">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
              className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Create User
            </button>
          </form>
        </div>

        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{user.username}</h3>
                  <p className="text-sm text-gray-500">
                    {user.admin ? 'Administrator' : 'Regular User'}
                  </p>
                </div>
                {user.id !== userId && (
                  deletingUser === user.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-sm text-rose-700 hover:text-rose-900"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingUser(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingUser(user.id)}
                      className="text-sm text-rose-700 hover:text-rose-900"
                    >
                      Delete
                    </button>
                  )
                )}
              </div>
              
              {editingUser?.id === user.id ? (
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="New Username"
                    className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="New Password"
                    className="block w-full rounded-full border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setEditPassword('');
                        setEditUsername('');
                      }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setEditUsername(user.username);
                  }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit User
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AccountsPage;
