# 🕐 SYSTÈME DE GESTION DES PRÉSENCES - EMPLOYÉS

## Vue d'ensemble

Chaque **employé** peut maintenant marquer sa présence de manière autonome. Le **HR** peut consulter et gérer tous les pointages.

---

## 📋 POUR LES EMPLOYÉS

### 1️⃣ **Où marquer sa présence ?**
- Accédez à : `/dashboard/employee/attendance`
- Interface intuitive avec boutons **"Pointer l'arrivée"** et **"Pointer le départ"**

### 2️⃣ **Comment ça fonctionne ?**

#### ✅ Marquer l'arrivée
```
1. Cliquez sur "Pointer l'arrivée"
2. L'heure actuelle est enregistrée (format HH:MM)
3. Vous voyez : "✅ Pointage entrée enregistré à 08:30"
```

#### ✅ Marquer le départ
```
1. Cliquez sur "Pointer le départ"
2. L'heure actuelle est enregistrée
3. Vous voyez : "✅ Pointage sortie enregistré à 17:00"
```

### 3️⃣ **Statuts automatiques**

| Statut | Condition |
|--------|-----------|
| **PRÉSENT** | Arrive avant 08:00 |
| **RETARD** | Arrive après 08:00 |
| **ABSENT** | Aucun pointage d'entrée |
| **DEMI-JOURNÉE** | Absence l'après-midi |
| **CONGÉ** | Approuvé par RH |

### 4️⃣ **Historique mensuel**

Consultez facilement :
- 📅 Date et jour de la semaine
- 🕐 Heure d'arrivée et départ
- ⏰ Retard en minutes
- ⏱️ Heures supplémentaires
- 📝 Notes additionnelles

### 5️⃣ **Statistiques du mois**

```
✅ Présents: X jours
❌ Absents: X jours
⏰ Retards: X fois
🏖️ Congés: X jours
```

---

## 📊 POUR LE RH (RESSOURCES HUMAINES)

### 1️⃣ **Où gérer les pointages ?**
- Accédez à : `/dashboard/hr` (l'onglet "Pointages" ou via le menu)
- Ou directement : `/dashboard/hr/attendance`

### 2️⃣ **Filtres disponibles**

#### Par date
```
📅 Sélectionnez une date spécifique
→ Voir tous les pointages de ce jour
```

#### Par employé
```
👤 Choisir un employé dans la liste
→ Voir UNIQUEMENT ses pointages
```

#### Par statut
```
Status:
  ✅ Présent
  ❌ Absent
  ⏰ En retard
  📝 Demi-journée
  🏖️ Congé
```

### 3️⃣ **Tableau de bord**

Vous voyez en temps réel :

```
📊 Total: 25 pointages
✅ Présents: 22
❌ Absents: 2
⏰ Retards: 3
⏱️ Heures sup totales: 8.5h
```

### 4️⃣ **Colonnes du tableau**

| Colonne | Affiche |
|---------|---------|
| **Employé** | Nom complet |
| **Poste** | Titre du poste |
| **Arrivée** | Heure d'arrivée (HH:MM) |
| **Départ** | Heure de départ (HH:MM) |
| **Statut** | ✅ Présent / ❌ Absent / ⏰ Retard / etc. |
| **Détails** | Retard en min / Heures sup / Notes |
| **Actions** | ❌ Supprimer si correction nécessaire |

### 5️⃣ **Actions possibles**

#### ✏️ Voir les détails
```
Cliquez sur un employé pour voir :
- Ses pointages de la journée
- Ses heures supplémentaires
- Son taux d'assiduité mensuel
- Ses congés approuvés
```

#### ❌ Supprimer un pointage
```
Si erreur :
1. Cliquez "Supprimer"
2. Confirmez
3. L'employé peut ré-enregistrer
```

#### 📥 Télécharger un rapport
```
Génère un PDF avec :
- Tous les pointages du mois
- Statistiques par employé
- Totalisation des heures sup
- Retards et absences
```

---

## 🔐 PERMISSIONS (RLS)

### ✅ Employé peut...
- ✅ Voir ses propres pointages
- ✅ Marquer son arrivée
- ✅ Marquer son départ (même jour uniquement)

### ✅ RH peut...
- ✅ Voir tous les pointages de son école
- ✅ Insérer/modifier/supprimer les pointages
- ✅ Gérer les congés
- ✅ Générer des rapports

### ✅ ADMIN peut...
- ✅ Même chose que RH

### ✅ SUPER_ADMIN peut...
- ✅ Accéder aux pointages de TOUTES les écoles

---

## 📱 INTERFACE - VUE EMPLOYÉ

```
┌─────────────────────────────────────┐
│ 🕐 Gestion de ma Présence          │
│   "Marquez votre présence..."      │
└─────────────────────────────────────┘

┌─ AUJOURD'HUI (10 février 2026) ───┐
│ Poste: Professeur de Français      │
│                                     │
│ ┌─ STATUT ────────────────────────┐│
│ │ Heure d'arrivée:  08:30        ││
│ │ Heure de départ:  17:00        ││
│ │ Statut:           ✅ PRÉSENT    ││
│ │                                  ││
│ │ [ Pointer le départ ]           ││
│ └────────────────────────────────┘│
└─────────────────────────────────────┘

✅ Présents: 18       ⏰ Retards: 1
❌ Absents: 1        🏖️ Congés: 0

┌─ HISTORIQUE DU MOIS ──────────────┐
│ Date     │ Arrivée │ Départ │ Statut│
├──────────┼─────────┼────────┼───────┤
│ Lun 10   │ 08:30   │ 17:00  │ ✅   │
│ Ven 07   │ 08:45   │ 17:15  │ ⏰   │
│ Jeu 06   │ 09:00   │ 18:00  │ ⏰   │
└─────────────────────────────────┘
```

---

## 📊 INTERFACE - VUE RH

```
┌───────────────────────────────────────┐
│ Gestion des Pointages                │
│ "Consultez et gérez les pointages"  │
└───────────────────────────────────────┘

FILTRES:
[ 2026-02-10 ] [ Tous les employés ▼ ] [ Tous ▼ ]

STATISTIQUES:
┌──────┬──────┬──────┬─────┬──────┐
│ 📊25 │ ✅22 │ ❌2  │ ⏰3  │ ⏱️8h │
└──────┴──────┴──────┴─────┴──────┘

POINTAGES DU 10 FÉVRIER:
┌─────────────┬──────┬───────┬───────┬────────┬─────────┐
│ Employé     │Poste │Arrivée│Départ │ Statut │ Détails │
├─────────────┼──────┼───────┼───────┼────────┼─────────┤
│ Employé 1   │ Prof │ 08:30 │ 17:00 │ ✅    │ -      │
│ Marie Durand│ Prof │ 09:15 │ 17:30 │ ⏰    │ 15 min │
│ Pierre Lee  │ Prof │ ---   │ ---   │ ❌    │ -      │
└─────────────┴──────┴───────┴───────┴────────┴─────────┘
```

---

## 🔄 WORKFLOW EXEMPLE

### Jour 1 - Employé marque sa présence

```
08:30 → Employé clique "Pointer l'arrivée"
        ✅ Enregistrement OK
        ✅ Status: PRÉSENT

17:00 → Employé clique "Pointer le départ"
        ✅ Enregistrement OK
        ✅ Heures travaillées: 8h30
```

### Jour 2 - RH consulte les pointages

```
1. RH ouvre /dashboard/hr/attendance
2. Filtres: Date=Jour 1, Tous employés
3. Voit: Employé 1 - Arrivée: 08:30 - Départ: 17:00 - ✅ Présent
4. Statistiques: 15 présents, 2 absents, 1 retard
```

### Jour 3 - Correction nécessaire

```
1. RH voit erreur: Employé a marqué 09:00 au lieu de 08:30
2. RH clique "Supprimer"
3. Jean peut remarquer correctement la fois suivante
```

---

## ⚠️ IMPORTANT

### ✅ À faire
- ✅ Marquer chaque jour votre arrivée/départ
- ✅ Consulter votre historique mensuellement
- ✅ RH : Vérifier les anomalies

### ❌ À ne pas faire
- ❌ Marquer quelqu'un d'autre (RLS protège)
- ❌ Modifier un ancien pointage (RLS = même jour uniquement)
- ❌ Oublier de marquer le départ

---

## 🐛 DÉPANNAGE

### "Bouton grisé - Je ne peux pas pointer"
```
→ Vérifiez que vous êtes connecté en tant qu'employé
→ Vérifiez que l'employé existe dans la table employees
→ Attendez quelques secondes et rechargez
```

### "Erreur 403 - Accès refusé"
```
→ Les politiques RLS bloquent votre accès
→ Vérifiez que vous avez le rôle TEACHER, HR, ADMIN, etc.
→ Contactez le RH pour vérifier votre profil
```

### "Je vois les pointages de quelqu'un d'autre"
```
→ Vous avez le rôle HR ou ADMIN (normal!)
→ Les employés ne voient que LEURS pointages (sécurisé)
```

---

## 📞 CONTACT SUPPORT

Si vous rencontrez des problèmes :
1. Prenez une capture d'écran
2. Notez l'heure exacte du problème
3. Signalez au RH ou à l'administrateur

---

**Système mis à jour: 10 février 2026**
**Version: 1.0.0**
