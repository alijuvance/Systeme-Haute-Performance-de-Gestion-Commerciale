'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
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
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="flex flex-col items-center mb-6">
          <AvatarUpload 
            currentAvatar={user?.avatar ? `${api.defaults.baseURL}${user.avatar}` : undefined} 
            onUploadSuccess={(url) => setValue('avatar', url, { shouldValidate: true })} 
          />
          {errors.avatar && <span className="text-red-500 text-xs mt-2">{errors.avatar.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Nom complet"
            {...register('fullName')} 
            error={errors.fullName?.message}
          />
          <Input 
            label="Email"
            type="email"
            {...register('email')} 
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Rôle"
            {...register('roleId')}
            error={errors.roleId?.message}
            options={[
              { value: '', label: 'Sélectionner un rôle', disabled: true },
              ...roles.map(r => ({ value: r.id, label: r.name }))
            ]}
          />
          <Select 
            label="Dépôt d'affectation"
            {...register('depotId')}
            options={[
              { value: '', label: 'Tous les dépôts / Aucun' },
              ...depots.map(d => ({ value: d.id, label: d.name }))
            ]}
          />
        </div>

        <Input 
          label={`Mot de passe ${user ? '(Optionnel)' : '*'}`}
          type="password"
          {...register('password')} 
          error={errors.password?.message}
          placeholder={user ? "Laissez vide pour ne pas modifier" : "Mot de passe"}
        />

        <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isLoading}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
};
