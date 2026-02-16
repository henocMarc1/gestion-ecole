/**
 * EXEMPLE D'UTILISATION - Composants Responsive
 * 
 * Ce fichier montre comment utiliser les nouveaux composants
 * ResponsiveTable et ResponsiveModal
 */
'use client';

import { useState } from 'react';
import { ResponsiveTable } from '@/components/ui/TableContainer';
import { ResponsiveModal } from '@/components/ui/ResponsiveModal';
import { Button, Card, Icons } from '@/components/ui';

export default function ExamplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Exemple Responsive</h1>

      {/* EXEMPLE 1: Tableau Responsive */}
      <Card>
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Tableau avec scroll horizontal</h2>
          
          <ResponsiveTable minWidth="900px">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm">001</td>
                <td className="px-4 py-3 text-sm font-medium">Utilisateur Exemple</td>
                <td className="px-4 py-3 text-sm">utilisateur@example.com</td>
                <td className="px-4 py-3 text-sm">+225 01 02 03 04</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                    Actif
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">14/02/2026</td>
                <td className="px-4 py-3 text-right">
                  <button 
                    className="p-2 hover:bg-primary-50 rounded text-primary-600"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Icons.Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </ResponsiveTable>
        </div>
      </Card>

      {/* EXEMPLE 2: Modal Responsive */}
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Détails de l'utilisateur"
        maxWidth="lg"
        footer={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Enregistrer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                placeholder="Nom complet"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="jean@example.com"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              defaultValue="Information sur l'utilisateur..."
            />
          </div>

          {/* Contenu supplémentaire pour tester le scroll */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  Section {i}: Contenu supplémentaire pour tester le scroll dans la modal
                </p>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveModal>

      {/* Bouton pour ouvrir le modal */}
      <Card>
        <div className="p-6 text-center">
          <Button onClick={() => setIsModalOpen(true)}>
            <Icons.Eye className="w-4 h-4 mr-2" />
            Ouvrir le modal responsive
          </Button>
        </div>
      </Card>
    </div>
  );
}
