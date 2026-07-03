'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, ShieldOff, Edit } from 'lucide-react';
import api from '@/api/axios';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { formatDate } from '@/utils/formatters';
import { UserModal } from '@/features/users/components/UserModal';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/api/users/${id}/status`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Erreur lors du changement de statut');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? u.role.name === filterRole : true;
    const matchesStatus = filterStatus ? (filterStatus === 'ACTIVE' ? u.isActive : !u.isActive) : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns: ColumnDef<any>[] = [
    {
      header: 'Utilisateur',
      key: 'fullName',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            {user.avatar ? (
              <img src={`${api.defaults.baseURL}${user.avatar}`} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium text-sm">
                {user.fullName.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-slate-900">{user.fullName}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Rôle',
      key: 'role',
      cell: (user) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
          {user.role?.name || 'Inconnu'}
        </span>
      )
    },
    {
      header: 'Dépôt',
      key: 'depot',
      cell: (user) => (
        <span className="text-sm text-slate-600">
          {user.depot?.name || '-'}
        </span>
      )
    },
    {
      header: 'Statut',
      key: 'isActive',
      cell: (user) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {user.isActive ? 'Actif' : 'Suspendu'}
        </span>
      )
    },
    {
      header: 'Dernière connexion',
      key: 'lastLogin',
      cell: (user) => (
        <span className="text-sm text-slate-500">
          {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'id',
      cell: (user) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <Edit className="w-4 h-4 text-slate-500" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleToggleStatus(user.id)}
            className={`h-8 w-8 p-0 flex items-center justify-center ${user.isActive ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-600'}`}
            title={user.isActive ? 'Suspendre' : 'Activer'}
          >
            {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des Utilisateurs" 
        description="Gérez les accès, rôles et statuts de vos collaborateurs."
      >
        <Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </PageHeader>

      <div className="bg-white p-4 rounded-xl border border-slate-200  flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur (Nom, Email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
          />
        </div>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-950"
        >
          <option value="">Tous les rôles</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
        </select>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-950"
        >
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="SUSPENDED">Suspendu</option>
        </select>
      </div>

      <DataTable 
        data={filteredUsers}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(user) => user.id}
      />

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </div>
  );
}
