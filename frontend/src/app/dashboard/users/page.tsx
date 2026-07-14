'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, ShieldOff, Pencil, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { formatDate } from '@/utils/formatters';
import { UserModal } from '@/features/users/components/UserModal';
import { useToast } from '@/components/providers/ToastProvider';
import { Badge } from '@/components/shared/Badge';
import { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

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
      toast.error('Erreur lors du changement de statut.');
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Supprimer cet utilisateur',
      message: 'Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?',
      variant: 'danger',
      confirmText: 'Supprimer',
    });
    if (ok) {
      try {
        await api.delete(`/api/users/${id}`);
        toast.success('Utilisateur supprimé avec succès.');
        fetchUsers();
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? u.role.name === filterRole : true;
    const matchesStatus = filterStatus ? (filterStatus === 'ACTIVE' ? u.isActive : !u.isActive) : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns: ColumnDef<User>[] = [
    {
      header: 'Utilisateur',
      key: 'fullName',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0">
            {user.avatar ? (
              <img src={`${api.defaults.baseURL}${user.avatar}`} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500 font-medium text-sm">
                {user.fullName.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-neutral-900">{user.fullName}</div>
            <div className="text-sm text-neutral-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Rôle',
      key: 'role',
      cell: (user) => (
        <Badge variant={user.role?.name === 'ADMIN' ? 'primary' : 'info'}>
          {user.role?.name || 'Inconnu'}
        </Badge>
      )
    },
    {
      header: 'Dépôt',
      key: 'depot',
      cell: (user) => (
        <span className="text-sm text-neutral-600">
          {user.depot?.name || '-'}
        </span>
      )
    },
    {
      header: 'Statut',
      key: 'isActive',
      cell: (user) => (
        <Badge variant={user.isActive ? 'success' : 'danger'}>
          {user.isActive ? 'Actif' : 'Suspendu'}
        </Badge>
      )
    },
    {
      header: 'Dernière connexion',
      key: 'lastLogin',
      cell: (user) => (
        <span className="text-sm text-neutral-500">
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
            variant="ghost" 
            size="icon"
            onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
            title="Modifier"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleToggleStatus(user.id)}
            className={user.isActive ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-600'}
            title={user.isActive ? 'Suspendre' : 'Activer'}
          >
            {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleDelete(user.id)}
            className="hover:bg-red-50 hover:text-red-600"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
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

      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur (Nom, Email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 focus:bg-white transition-all duration-200"
          />
        </div>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 focus:bg-white transition-all duration-200"
        >
          <option value="">Tous les rôles</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
        </select>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 focus:bg-white transition-all duration-200"
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