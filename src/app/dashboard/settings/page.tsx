'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Settings as SettingsIcon, User, Lock, Bell, Globe, Save, AlertTriangle, Database, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success('Mot de passe mis à jour avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (resetConfirmation !== 'SUPPRIMER TOUTES LES DONNEES') {
      toast.error('La confirmation ne correspond pas');
      return;
    }

    setIsResetting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const response = await fetch('/api/database/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          confirmation: resetConfirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la réinitialisation');
      }

      toast.success(result.message);
      setShowResetModal(false);
      setResetConfirmation('');
      
      // Déconnecter l'utilisateur après réinitialisation
      setTimeout(async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      console.error('Erreur réinitialisation:', error);
      toast.error(error.message || 'Erreur lors de la réinitialisation');
    } finally {
      setIsResetting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    ...(user?.role === 'SUPER_ADMIN' ? [{ id: 'danger', label: 'Zone de danger', icon: AlertTriangle }] : []),
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Paramètres
        </h1>
        <p className="text-gray-600 mt-1">Gérez vos paramètres et préférences</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du profil</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sécurité</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                <p className="text-gray-600">Configuration des notifications disponible prochainement.</p>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Préférences</h2>
                <p className="text-gray-600">Configuration des préférences disponible prochainement.</p>
              </div>
            )}

            {/* Danger Zone Tab - SUPER_ADMIN only */}
            {activeTab === 'danger' && user?.role === 'SUPER_ADMIN' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Zone de danger</h2>
                    <p className="text-sm text-gray-600">Actions irréversibles - Utilisez avec précaution</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Reset Database Section */}
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Réinitialiser la base de données
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                          ⚠️ <strong>ATTENTION :</strong> Cette action supprimera <strong>TOUTES</strong> les données de la base :
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 mb-4 ml-4 list-disc">
                          <li>Tous les utilisateurs (vous serez déconnecté)</li>
                          <li>Tous les élèves et leurs données</li>
                          <li>Toutes les classes et années académiques</li>
                          <li>Tous les paiements et factures</li>
                          <li>Toutes les présences et notes</li>
                          <li>Tous les messages et notifications</li>
                        </ul>
                        <div className="bg-white border border-red-300 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            💡 <strong>Recommandations :</strong>
                          </p>
                          <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                            <li>Exportez les données importantes avant</li>
                            <li>Prévenez tous les utilisateurs</li>
                            <li>Vérifiez que c'est vraiment nécessaire</li>
                            <li>Cette action ne peut pas être annulée</li>
                          </ol>
                        </div>
                        <button
                          onClick={() => setShowResetModal(true)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          Réinitialiser la base de données
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-red-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">⚠️ CONFIRMATION REQUISE</h2>
                  <p className="text-red-100 text-sm mt-1">Action irréversible - Réinitialisation totale</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                <p className="text-red-900 font-semibold text-lg mb-3">
                  🚨 Vous êtes sur le point de SUPPRIMER DÉFINITIVEMENT :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-4 h-4" />
                    <span>Tous les utilisateurs</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-4 h-4" />
                    <span>Tous les élèves</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-4 h-4" />
                    <span>Toutes les classes</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-4 h-4" />
                    <span>Tous les paiements</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-4 h-4" />
                    <span>Toutes les présences</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-800">
                    <Trash2 className="w-4 h-4" />
                    <span>Toutes les données</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-yellow-900 text-sm font-medium mb-2">⏰ Conséquences immédiates :</p>
                <ul className="text-yellow-800 text-sm space-y-1 ml-4 list-disc">
                  <li>Vous serez déconnecté automatiquement</li>
                  <li>Tous les comptes seront supprimés</li>
                  <li>Il faudra recréer un compte administrateur</li>
                  <li>Toutes les données historiques seront perdues</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Pour confirmer, tapez exactement :
                  <span className="block mt-2 px-4 py-2 bg-gray-100 rounded-lg text-red-600 font-mono text-base">
                    SUPPRIMER TOUTES LES DONNEES
                  </span>
                </label>
                <input
                  type="text"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  placeholder="Tapez la phrase exacte ci-dessus..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {resetConfirmation && resetConfirmation !== 'SUPPRIMER TOUTES LES DONNEES' && (
                <p className="text-red-600 text-sm font-medium">❌ La confirmation ne correspond pas</p>
              )}
              {resetConfirmation === 'SUPPRIMER TOUTES LES DONNEES' && (
                <p className="text-green-600 text-sm font-medium">✅ Confirmation valide</p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmation('');
                }}
                disabled={isResetting}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleResetDatabase}
                disabled={resetConfirmation !== 'SUPPRIMER TOUTES LES DONNEES' || isResetting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {isResetting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Réinitialisation en cours...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Confirmer la suppression
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
