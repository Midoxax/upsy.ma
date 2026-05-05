---
name: Intake Form System (Phase G)
description: 9-section clinical intake form with PHQ-9/GAD-7/PSS-10, crisis detection, AI clinical briefs
type: feature
---
- Route: /intake and /intake/:bookingId (protected)
- DB: Evolved client_anamneses with new columns (relationships, specialized_module, objectives_consent, scores, flags, completion tracking)
- New tables: intake_clinical_briefs, crisis_alerts
- Edge functions: notify-intake-trigger (email + in-app notification), generate-clinical-brief (Lovable AI Gateway gemini-2.5-flash)
- Crisis detection: PHQ-9 item 9 >= 1 triggers CrisisModal + crisis_alerts row
- Clinical flags computed on completion: suicide ideation, severe depression, severe anxiety, high stress, current violence
- Remaining: Psy brief dashboard view (Task 5835948b), GDPR consent modal + export/delete (Task 80e9865c)
