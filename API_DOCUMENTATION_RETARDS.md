# 📡 API DOCUMENTATION - Gestion des Retards de Paiement

**Version**: 1.0
**Base URL**: `https://ecole.app/api`
**Authentication**: Bearer Token (JWT via Supabase)

---

## 📚 ENDPOINTS OVERVIEW

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/accountant/escalation/levels` | GET | Lister niveaux d'escalade |
| `/accountant/escalation/config` | PUT | Configurer niveaux |
| `/accountant/late-fees/config` | GET/PUT | Voir/Modifier config frais |
| `/accountant/students/overdue` | GET | Lister étudiants en retard |
| `/accountant/arrangements` | GET/POST | Voir/Proposer arrangements |
| `/accountant/documents/block` | POST | Bloquer document |
| `/accountant/documents/unblock` | POST | Débloquer document |
| `/parent/payment-status` | GET | Voir mon statut paiement |
| `/parent/arrangements` | GET/PUT | Voir/Accepter arrangements |

---

## 🔑 AUTHENTIFICATION

### Headers requis
```http
Authorization: Bearer eyJhbGc...

X-School-ID: uuid-of-school  // Optionnel si dans JWT
```

### Réponses d'erreur
```json
{
  "error": "Unauthorized",
  "message": "Token invalide ou expiré",
  "code": "AUTH_INVALID_TOKEN"
}

{
  "error": "Forbidden",
  "message": "Vous n'avez pas accès à cette ressource",
  "code": "FORBIDDEN_SCHOOL_ID"
}
```

---

## 📊 GET /accountant/escalation/levels

### Description
Récupère tous les niveaux d'escalade configurés pour l'école

### Request
```http
GET /accountant/escalation/levels
Authorization: Bearer TOKEN
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "school_id": "uuid-school",
      "level": 1,
      "level_name": "Avertissement doux",
      "level_description": "Rappel amical lors des premiers jours de retard",
      "days_overdue_min": 0,
      "days_overdue_max": 5,
      "send_email": true,
      "send_sms": false,
      "email_subject": "⏰ Rappel - Facture en attente",
      "email_template": "<html>...",
      "sms_template": null,
      "notify_accountant": false,
      "notify_principal": false,
      "block_documents": false,
      "apply_late_fee": false,
      "is_active": true,
      "created_at": "2026-02-11T10:00:00Z",
      "updated_at": "2026-02-11T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "level": 2,
      "level_name": "1ère Relance officielle",
      "days_overdue_min": 6,
      "days_overdue_max": 15,
      "send_email": true,
      "send_sms": true,
      "email_subject": "⚠️ 1ère RELANCE - Facture en retard",
      "notify_accountant": true,
      "notify_principal": false,
      "apply_late_fee": true,
      "is_active": true,
      ...
    },
    ...
  ],
  "count": 5,
  "pagination": { "page": 1, "per_page": 50 }
}
```

### Erreurs possibles
```json
{
  "error": "School not found",
  "message": "L'école n'a pas été trouvé",
  "code": "NOT_FOUND_SCHOOL"
}

{
  "error": "No escalation levels configured",
  "message": "Aucun niveau d'escalade configuré",
  "code": "NO_DATA"
}
```

---

## ⚙️ PUT /accountant/escalation/config

### Description
Crée ou modifie les niveaux d'escalade pour une école

### Request
```http
PUT /accountant/escalation/config
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "levels": [
    {
      "level": 1,
      "level_name": "Avertissement doux",
      "level_description": "Rappel amical",
      "days_overdue_min": 0,
      "days_overdue_max": 5,
      "send_email": true,
      "send_sms": false,
      "email_subject": "⏰ Rappel - Facture en attente",
      "email_template": "<html><body>...",
      "notify_accountant": false,
      "notify_principal": false,
      "block_documents": false,
      "apply_late_fee": false,
      "is_active": true
    },
    {
      "level": 2,
      "level_name": "1ère Relance officielle",
      "days_overdue_min": 6,
      "days_overdue_max": 15,
      "send_email": true,
      "send_sms": true,
      "email_subject": "⚠️ 1ère RELANCE",
      "email_template": "<html>...",
      "sms_template": "[ÉCOLE] 1ère relance: [AMOUNT]XOF dû. Payer avant [DATE]",
      "notify_accountant": true,
      "notify_principal": false,
      "block_documents": false,
      "apply_late_fee": true,
      "is_active": true
    }
  ]
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Configuration mise à jour avec succès",
  "data": {
    "created": 0,
    "updated": 2,
    "total": 5
  }
}
```

### Validation errors
```json
{
  "error": "Validation error",
  "message": "Erreur de validation",
  "errors": [
    {
      "field": "levels[1].days_overdue_min",
      "message": "days_overdue_min doit être > days_overdue_max du niveau précédent"
    },
    {
      "field": "levels[2].email_subject",
      "message": "email_subject est requis si send_email=true"
    }
  ]
}
```

---

## 💰 GET /accountant/late-fees/config

### Description
Voir la configuration des frais de retard

### Request
```http
GET /accountant/late-fees/config
Authorization: Bearer TOKEN
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid-config-1",
    "school_id": "uuid-school",
    "fee_type": "progressive",
    "flat_amount": null,
    "percentage_per_month": null,
    "max_percentage": null,
    "progressive_tier_1_days": 30,
    "progressive_tier_1_fee": 2000,
    "progressive_tier_2_days": 60,
    "progressive_tier_2_fee": 4000,
    "progressive_tier_3_days": 90,
    "progressive_tier_3_fee": 5000,
    "is_active": true,
    "created_at": "2026-02-11T10:00:00Z",
    "updated_at": "2026-02-11T10:00:00Z"
  }
}
```

---

## 🔧 PUT /accountant/late-fees/config

### Description
Modifier la configuration des frais de retard

### Request
```http
PUT /accountant/late-fees/config
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "fee_type": "progressive",
  "progressive_tier_1_days": 30,
  "progressive_tier_1_fee": 2000,
  "progressive_tier_2_days": 60,
  "progressive_tier_2_fee": 4000,
  "progressive_tier_3_days": 90,
  "progressive_tier_3_fee": 5000,
  "is_active": true
}

// OU pour frais fixes:
{
  "fee_type": "flat_fee",
  "flat_amount": 5000,
  "is_active": true
}

// OU pour pourcentage:
{
  "fee_type": "percentage",
  "percentage_per_month": 2.5,
  "max_percentage": 15,
  "is_active": true
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Configuration mise à jour",
  "data": {
    "id": "uuid-config-1",
    "school_id": "uuid-school",
    "fee_type": "progressive",
    "progressive_tier_1_days": 30,
    "progressive_tier_1_fee": 2000,
    "progressive_tier_2_days": 60,
    "progressive_tier_2_fee": 4000,
    "progressive_tier_3_days": 90,
    "progressive_tier_3_fee": 5000,
    "is_active": true,
    "updated_at": "2026-02-11T15:30:00Z"
  }
}
```

---

## 👥 GET /accountant/students/overdue

### Description
Lister tous les étudiants avec factures en retard

### Request
```http
GET /accountant/students/overdue?page=1&per_page=20&filter_class=uuid-class&filter_days=60&sort=-days_overdue
Authorization: Bearer TOKEN
```

### Query Parameters
```
page: integer (default: 1)
per_page: integer (default: 20, max: 100)

Filters:
- filter_class: uuid (filter par classe)
- filter_days: integer (retards > X jours. Options: 15, 30, 60, 90)
- filter_escalation_level: integer (1-5, filter par niveau)
- filter_amount_min: decimal (montant dû > X)
- filter_amount_max: decimal (montant dû < X)
- filter_has_arrangement: boolean (true = a un arrangement proposé)

sort: string
- days_overdue (croissant)
- -days_overdue (décroissant)
- amount_due (croissant)
- -amount_due (décroissant)
- escalation_level
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "student-uuid-1",
      "first_name": "Jean",
      "last_name": "Dupont",
      "class_id": "class-uuid",
      "class_name": "6è A",
      "total_due": 450000,
      "total_paid": 150000,
      "max_days_overdue": 45,
      "avg_days_overdue": 38,
      "total_late_fees": 6000,
      "current_escalation_level": 3,
      "escalation_level_name": "2ème Relance avec frais",
      "has_blocked_documents": true,
      "blocked_documents": ["bulletin", "certificat_scolarite"],
      "has_active_arrangement": false,
      "last_activity": "2026-02-10T14:20:00Z",
      "parent_email": "parent@email.com",
      "parent_phone": "+225XXXXXXXXX",
      "invoices": [
        {
          "id": "invoice-uuid-1",
          "amount": 250000,
          "paid": 0,
          "due_date": "2025-12-31",
          "status": "OVERDUE",
          "days_overdue": 42,
          "late_fees_applied": 6000
        }
      ]
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 47,
    "total_pages": 3
  },
  "summary": {
    "total_overdue_amount": 21450000,
    "total_students": 47,
    "total_late_fees": 180000,
    "students_by_level": {
      "1": 15,
      "2": 18,
      "3": 10,
      "4": 3,
      "5": 1
    }
  }
}
```

### Erreurs
```json
{
  "error": "Invalid filter",
  "message": "filter_days doit être parmi: 15, 30, 60, 90",
  "code": "INVALID_FILTER"
}
```

---

## 📋 POST /accountant/arrangements

### Description
Proposer un arrangement de paiement à un parent

### Request
```http
POST /accountant/arrangements
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "invoice_id": "invoice-uuid-1",
  "student_id": "student-uuid-1",
  "school_id": "school-uuid",
  "arrangement_type": "installments",
  "num_installments": 3,
  "installment_amount": 150000,
  "first_installment_date": "2026-02-25",
  "justification": "Parent en difficultés financières temporaires - a perdu emploi",
  "supporting_document_url": "https://...",
  "original_due_date": "2025-12-31",
  "new_due_date": "2026-04-30"
}

// Ou pour un simple report:
{
  "invoice_id": "invoice-uuid-1",
  "student_id": "student-uuid-1",
  "arrangement_type": "full_defer",
  "original_due_date": "2025-12-31",
  "new_due_date": "2026-03-31",
  "justification": "Situation médicale urgente"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Arrangement proposé - En attente d'acceptation du parent",
  "data": {
    "id": "arrangement-uuid-1",
    "invoice_id": "invoice-uuid-1",
    "student_id": "student-uuid-1",
    "arrangement_type": "installments",
    "status": "proposed",
    "num_installments": 3,
    "installment_amount": 150000,
    "first_installment_date": "2026-02-25",
    "original_due_date": "2025-12-31",
    "new_due_date": "2026-04-30",
    "proposed_at": "2026-02-11T14:30:00Z",
    "proposed_by_user": "comptable@school.com",
    "accepted_at": null,
    "created_at": "2026-02-11T14:30:00Z"
  },
  "notification": {
    "email_sent": "parent@email.com",
    "message": "Un arrangement de paiement vous a été proposé"
  }
}
```

### Validation errors
```json
{
  "error": "Validation error",
  "errors": [
    {
      "field": "new_due_date",
      "message": "new_due_date doit être après original_due_date"
    },
    {
      "field": "num_installments",
      "message": "num_installments doit être entre 2 et 12"
    }
  ]
}
```

---

## GET /accountant/arrangements

### Description
Voir tous les arrangements (proposés, acceptés, en cours)

### Request
```http
GET /accountant/arrangements?status=proposed&student_id=uuid&sort=-proposed_at
Authorization: Bearer TOKEN
```

### Query Parameters
```
status: string (proposed, accepted, rejected, completed, defaulted)
student_id: uuid (filter par étudiant)
invoice_id: uuid (filter par facture)
sort: string (-proposed_at, status)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "arrangement-uuid-1",
      "invoice_id": "invoice-uuid-1",
      "student_id": "student-uuid-1",
      "student_name": "Nom Élève",
      "class_name": "6è A",
      "arrangement_type": "installments",
      "status": "accepted",
      "total_amount": 450000,
      "num_installments": 3,
      "installment_amount": 150000,
      "first_installment_date": "2026-02-25",
      "original_due_date": "2025-12-31",
      "new_due_date": "2026-04-30",
      "proposed_at": "2026-02-10T10:00:00Z",
      "accepted_at": "2026-02-10T16:30:00Z",
      "accepted_by_parent": "parent@email.com",
      "justification": "Parent en difficultés...",
      "created_at": "2026-02-10T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 8 }
}
```

---

## 🚫 POST /accountant/documents/block

### Description
Bloquer l'accès à un document pour un étudiant en retard

### Request
```http
POST /accountant/documents/block
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "student_id": "student-uuid-1",
  "invoice_id": "invoice-uuid-1",
  "document_type": "bulletin",
  "restriction_reason": "payment_overdue",
  "amount_due_at_blocking": 450000,
  "days_overdue_at_blocking": 45,
  "payment_amount_required": 450000
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Document bloqué avec succès",
  "data": {
    "id": "restriction-uuid-1",
    "student_id": "student-uuid-1",
    "document_type": "bulletin",
    "restriction_reason": "payment_overdue",
    "blocked_at": "2026-02-11T14:30:00Z",
    "blocked_by": "comptable@school.com",
    "payment_amount_required": 450000,
    "unblocked_at": null,
    "documents_blocked_count": 2
  }
}
```

---

## 🔓 POST /accountant/documents/unblock

### Description
Débloquer l'accès à un document (après paiement ou décision direction)

### Request
```http
POST /accountant/documents/unblock
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "restriction_id": "restriction-uuid-1",
  "unblock_reason": "payment_received",
  "admin_override": false
}

// Ou avec override (directeur):
{
  "restriction_id": "restriction-uuid-1",
  "unblock_reason": "director_override",
  "admin_override": true,
  "override_justification": "Situation humanitaire - Directeur"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Document débloqué",
  "data": {
    "restriction_id": "restriction-uuid-1",
    "student_id": "student-uuid-1",
    "document_type": "bulletin",
    "unblocked_at": "2026-02-11T15:00:00Z",
    "unblocked_by": "comptable@school.com",
    "unblock_reason": "payment_received"
  }
}
```

---

## 👨‍👩‍👧 GET /parent/payment-status

### Description (Pour le parent)
Voir son statut de paiement et retards

### Request
```http
GET /parent/payment-status
Authorization: Bearer TOKEN
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "student-uuid-1",
        "first_name": "Jean",
        "last_name": "Dupont",
        "class_name": "6è A",
        "total_due": 450000,
        "total_paid": 150000,
        "total_remaining": 300000,
        "invoices": [
          {
            "id": "invoice-uuid-1",
            "amount": 250000,
            "paid": 0,
            "due_date": "2025-12-31",
            "status": "OVERDUE",
            "days_overdue": 42,
            "late_fees_applied": 6000,
            "total_with_fees": 256000
          },
          {
            "id": "invoice-uuid-2",
            "amount": 200000,
            "paid": 150000,
            "due_date": "2026-01-31",
            "status": "PARTIALLY_PAID",
            "remaining": 50000
          }
        ],
        "documents_blocked": ["bulletin"],
        "active_arrangement": {
          "id": "arrangement-uuid-1",
          "type": "installments",
          "num_installments": 3,
          "amount_per_installment": 150000,
          "next_payment_date": "2026-02-25",
          "next_payment_amount": 150000
        },
        "last_reminders": [
          {
            "level": 2,
            "level_name": "1ère Relance officielle",
            "sent_at": "2026-02-10T09:00:00Z"
          }
        ]
      }
    ],
    "summary": {
      "total_due_all_students": 450000,
      "total_overdue": 300000,
      "total_late_fees": 6000,
      "documents_blocked_count": 1,
      "has_active_arrangements": true
    }
  }
}
```

---

## PUT /parent/arrangements/{id}/accept

### Description (Pour le parent)
Accepter une proposition d'arrangement

### Request
```http
PUT /parent/arrangements/arrangement-uuid-1/accept
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "accepted_with_conditions": false
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Arrangement accepté - Vos versements sont confirmés",
  "data": {
    "id": "arrangement-uuid-1",
    "status": "accepted",
    "accepted_at": "2026-02-11T16:00:00Z",
    "payment_schedule": [
      {
        "installment": 1,
        "due_date": "2026-02-25",
        "amount": 150000,
        "paid": false
      },
      {
        "installment": 2,
        "due_date": "2026-03-25",
        "amount": 150000,
        "paid": false
      },
      {
        "installment": 3,
        "due_date": "2026-04-25",
        "amount": 150000,
        "paid": false
      }
    ]
  },
  "notification": "Confirmation envoyée par email"
}
```

---

## 📊 Codes d'erreur standard

```json
{
  "AUTH_INVALID_TOKEN": "Token invalide ou expiré",
  "AUTH_MISSING_TOKEN": "Token manquant",
  "FORBIDDEN_SCHOOL_ID": "Vous n'avez pas accès à cette école",
  "FORBIDDEN_ROLE": "Votre rôle n'a pas les permissions requises",
  "NOT_FOUND_ESCALATION": "Niveau d'escalade non trouvé",
  "NOT_FOUND_STUDENT": "Étudiant non trouvé",
  "NOT_FOUND_INVOICE": "Facture non trouvée",
  "NOT_FOUND_ARRANGEMENT": "Arrangement non trouvé",
  "VALIDATION_ERROR": "Erreur de validation des données",
  "DUPLICATE_ACTIVE_ARRANGEMENT": "Un arrangement actif existe déjà",
  "INVOICE_NOT_OVERDUE": "La facture n'est pas en retard",
  "ARRANGEMENT_ALREADY_ACCEPTED": "Cet arrangement a déjà été accepté",
  "DATABASE_ERROR": "Erreur base de données",
  "INTERNAL_SERVER_ERROR": "Erreur serveur interne"
}
```

---

## 🔒 Permissions par rôle

| Endpoint | SUPER_ADMIN | ADMIN | ACCOUNTANT | PARENT | STUDENT |
|----------|-------------|-------|-----------|--------|---------|
| GET /escalation/levels | ✅ | ✅ | ✅ | ❌ | ❌ |
| PUT /escalation/config | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /late-fees/config | ✅ | ✅ | ✅ | ❌ | ❌ |
| PUT /late-fees/config | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /students/overdue | ✅ | ✅ | ✅ | ❌ | ❌ |
| POST /arrangements | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /parent/payment-status | ✅ (all) | ✅ (school) | ✅ (school) | ✅ (own) | ❌ |
| PUT /parent/arrangements/*/accept | ✅ (all) | ✅ (school) | ❌ | ✅ (own) | ❌ |

---

## 💬 Support et Questions

Pour problèmes d'API:
- Slogan: "API Documentation - v1.0"
- Emails: [api-support@school.com]
- Issue tracker: [GitHub]

