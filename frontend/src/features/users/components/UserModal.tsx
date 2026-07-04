'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { AvatarUpload } from './AvatarUpload';
import { useToast } from '@/components/providers/ToastProvider';
import api from '@/api/axios';

const userSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().optional(),
  roleId: z.string().min(1, 'Le rôle est requis'),
  depotId: z.string().optional(),
  avatar: z.string().min(1, "L'avatar est obligatoire"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
}

export const UserModal = ({ isOpen, onClose, onSuccess, user }: UserModalProps) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [depots, setDepots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      roleId: '',
      depotId: '',
      avatar: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/api/roles').then(res => setRoles(res.data)).catch(console.error);
      api.get('/api/depots').then(res => setDepots(res.data)).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        depotId: user.depotId || '',
        avatar: user.avatar || '',
      });
    } else {
      reset({
        fullName: '',
        email: '',
        password: '',
        roleId: '',
        depotId: '',
        avatar: '',
      });
    }
  }, [user, reset]);

  const avatarUrl = watch('avatar');

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      const payload: any = { ...data };
      if (!payload.password) {
        delete payload.password;
      }
      if (!payload.depotId) {
        delete payload.depotId;
      }
      
      if (user) {
        await api.patch(`/api/users/${user.id}`, payload);
        toast.success('Utilisateur modifié avec succès.');
      } else {
        await api.post('/api/users', payload);
        toast.success('Utilisateur créé avec succès.');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="flex flex-col items-center mb-6">
          <AvatarUpload 
            currentAvatar={user?.avatar ? `${api.defaults.baseURL}${user.avatar}` : undefined} 
            onUploadSuccess={(url) => setValue('avatar', url, { shouldValidate: true })} 
          />
          {errors.avatar && <span className="text-red-500 text-xs mt-2">{errors.avatar.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <input 
              {...register('fullName')} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email"
              {...register('email')} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
            <select 
              {...register('roleId')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.roleId && <span className="text-red-500 text-xs">{errors.roleId.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dépôt d'affectation</label>
            <select 
              {...register('depotId')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="">Tous les dépôts / Aucun</option>
              {depots.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mot de passe {user ? '(Optionnel)' : '*'}
          </label>
          <input 
            type="password"
            {...register('password')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder={user ? "Laissez vide pour ne pas modifier" : "Mot de passe"}
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isLoading}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
};
