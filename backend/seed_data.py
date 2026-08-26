"""
Seed script - Populates the database with realistic rare disease data.

Usage:
    cd <project_root>
    python -m backend.seed_data
"""

import asyncio
import uuid
from datetime import date, datetime, timedelta, timezone
import random

from backend.database import async_session_factory, init_db
from backend.auth.security import hash_password
from backend.models import (
    User, UserRole, Patient, Sex, Disease, Diagnosis, DiagnosisStatus,
    Hospital, DataSharingStatus, Contribution, ContributionStatus, RecordType,
    AuditLog, FHIRResource,
)
from backend.services.fhir_service import generate_fhir_patient, generate_fhir_condition


# ──────────────────────────────────────────────
# Seed data constants
# ──────────────────────────────────────────────

HOSPITALS = [
    {"name": "Great Ormond Street Hospital", "code": "GOSH", "city": "London", "state": "England", "country": "United Kingdom", "status": DataSharingStatus.ACTIVE, "email": "data@gosh.nhs.uk"},
    {"name": "National Institutes of Health Clinical Center", "code": "NIH-CC", "city": "Bethesda", "state": "Maryland", "country": "United States", "status": DataSharingStatus.ACTIVE, "email": "research@nih.gov"},
    {"name": "Hôpital Necker-Enfants Malades", "code": "NECKER", "city": "Paris", "state": "Île-de-France", "country": "France", "status": DataSharingStatus.ACTIVE, "email": "contact@necker.aphp.fr"},
    {"name": "Charité – Universitätsmedizin Berlin", "code": "CHARITE", "city": "Berlin", "state": "Berlin", "country": "Germany", "status": DataSharingStatus.ACTIVE, "email": "rare@charite.de"},
    {"name": "Bambino Gesù Children's Hospital", "code": "BAMGES", "city": "Rome", "state": "Lazio", "country": "Italy", "status": DataSharingStatus.PENDING, "email": "research@opbg.net"},
    {"name": "Tokyo Medical University Hospital", "code": "TMU", "city": "Tokyo", "state": "Tokyo", "country": "Japan", "status": DataSharingStatus.ACTIVE, "email": "intl@tokyo-med.ac.jp"},
    {"name": "All India Institute of Medical Sciences", "code": "AIIMS", "city": "New Delhi", "state": "Delhi", "country": "India", "status": DataSharingStatus.PENDING, "email": "rarediseases@aiims.edu"},
    {"name": "Royal Children's Hospital", "code": "RCH", "city": "Melbourne", "state": "Victoria", "country": "Australia", "status": DataSharingStatus.ACTIVE, "email": "genomics@rch.org.au"},
]

DISEASES = [
    {"name": "Cystic Fibrosis", "orpha": "ORPHA:586", "icd10": "E84", "category": "Respiratory", "prevalence": "1:3,500", "inheritance": "Autosomal recessive", "onset": "Neonatal/Infancy", "desc": "A genetic disorder affecting the lungs, pancreas, and other organs due to defective CFTR protein.", "symptoms": ["chronic cough", "recurrent lung infections", "poor growth", "salty skin", "pancreatic insufficiency"], "genes": ["CFTR"]},
    {"name": "Huntington Disease", "orpha": "ORPHA:399", "icd10": "G10", "category": "Neurological", "prevalence": "1:10,000", "inheritance": "Autosomal dominant", "onset": "Adult", "desc": "A progressive neurodegenerative disorder caused by CAG repeat expansion in the HTT gene.", "symptoms": ["chorea", "cognitive decline", "psychiatric symptoms", "motor dysfunction", "weight loss"], "genes": ["HTT"]},
    {"name": "Duchenne Muscular Dystrophy", "orpha": "ORPHA:98896", "icd10": "G71.0", "category": "Neuromuscular", "prevalence": "1:5,000 males", "inheritance": "X-linked recessive", "onset": "Childhood", "desc": "A severe form of muscular dystrophy caused by mutations in the dystrophin gene.", "symptoms": ["progressive muscle weakness", "difficulty walking", "cardiomyopathy", "respiratory failure", "Gowers sign"], "genes": ["DMD"]},
    {"name": "Gaucher Disease", "orpha": "ORPHA:355", "icd10": "E75.2", "category": "Metabolic", "prevalence": "1:40,000", "inheritance": "Autosomal recessive", "onset": "Variable", "desc": "A lysosomal storage disorder caused by deficiency of glucocerebrosidase.", "symptoms": ["hepatosplenomegaly", "anemia", "thrombocytopenia", "bone pain", "fatigue"], "genes": ["GBA"]},
    {"name": "Marfan Syndrome", "orpha": "ORPHA:558", "icd10": "Q87.4", "category": "Connective Tissue", "prevalence": "1:5,000", "inheritance": "Autosomal dominant", "onset": "Childhood/Adolescence", "desc": "A connective tissue disorder affecting the heart, eyes, blood vessels, and skeleton.", "symptoms": ["tall stature", "aortic dilation", "lens subluxation", "long limbs", "scoliosis"], "genes": ["FBN1"]},
    {"name": "Phenylketonuria", "orpha": "ORPHA:716", "icd10": "E70.0", "category": "Metabolic", "prevalence": "1:10,000", "inheritance": "Autosomal recessive", "onset": "Neonatal", "desc": "An inborn error of metabolism caused by deficiency of phenylalanine hydroxylase.", "symptoms": ["intellectual disability", "seizures", "behavioral problems", "musty body odor", "light skin pigmentation"], "genes": ["PAH"]},
    {"name": "Ehlers-Danlos Syndrome, Hypermobile Type", "orpha": "ORPHA:285", "icd10": "Q79.6", "category": "Connective Tissue", "prevalence": "1:5,000", "inheritance": "Autosomal dominant", "onset": "Childhood", "desc": "A connective tissue disorder characterized by joint hypermobility and skin hyperextensibility.", "symptoms": ["joint hypermobility", "chronic pain", "skin fragility", "easy bruising", "fatigue"], "genes": ["COL5A1", "COL5A2"]},
    {"name": "Sickle Cell Disease", "orpha": "ORPHA:232", "icd10": "D57", "category": "Hematological", "prevalence": "1:500 (African descent)", "inheritance": "Autosomal recessive", "onset": "Infancy", "desc": "A group of inherited red blood cell disorders caused by abnormal hemoglobin.", "symptoms": ["pain crises", "anemia", "infections", "stroke", "organ damage"], "genes": ["HBB"]},
    {"name": "Rett Syndrome", "orpha": "ORPHA:778", "icd10": "F84.2", "category": "Neurological", "prevalence": "1:10,000 females", "inheritance": "X-linked dominant", "onset": "Infancy", "desc": "A neurodevelopmental disorder affecting brain development, primarily in females.", "symptoms": ["loss of hand skills", "stereotypic hand movements", "breathing irregularities", "seizures", "intellectual disability"], "genes": ["MECP2"]},
    {"name": "Wilson Disease", "orpha": "ORPHA:905", "icd10": "E83.0", "category": "Metabolic", "prevalence": "1:30,000", "inheritance": "Autosomal recessive", "onset": "Childhood/Adult", "desc": "A disorder of copper metabolism leading to accumulation in the liver and brain.", "symptoms": ["liver disease", "neurological symptoms", "Kayser-Fleischer rings", "psychiatric symptoms", "hemolytic anemia"], "genes": ["ATP7B"]},
    {"name": "Pompe Disease", "orpha": "ORPHA:365", "icd10": "E74.0", "category": "Metabolic", "prevalence": "1:40,000", "inheritance": "Autosomal recessive", "onset": "Variable", "desc": "A glycogen storage disease caused by deficiency of acid alpha-glucosidase.", "symptoms": ["progressive muscle weakness", "respiratory insufficiency", "cardiomyopathy", "feeding difficulties", "hypotonia"], "genes": ["GAA"]},
    {"name": "Fabry Disease", "orpha": "ORPHA:324", "icd10": "E75.2", "category": "Metabolic", "prevalence": "1:40,000", "inheritance": "X-linked", "onset": "Childhood/Adolescence", "desc": "A lysosomal storage disorder due to deficiency of alpha-galactosidase A.", "symptoms": ["acroparesthesias", "angiokeratomas", "renal failure", "cardiomyopathy", "stroke"], "genes": ["GLA"]},
    {"name": "Tuberous Sclerosis Complex", "orpha": "ORPHA:805", "icd10": "Q85.1", "category": "Neurocutaneous", "prevalence": "1:6,000", "inheritance": "Autosomal dominant", "onset": "Variable", "desc": "A multi-system genetic disorder causing benign tumors in the brain and other organs.", "symptoms": ["skin lesions", "seizures", "intellectual disability", "renal angiomyolipomas", "cardiac rhabdomyomas"], "genes": ["TSC1", "TSC2"]},
    {"name": "Spinal Muscular Atrophy", "orpha": "ORPHA:70", "icd10": "G12.0", "category": "Neuromuscular", "prevalence": "1:10,000", "inheritance": "Autosomal recessive", "onset": "Variable", "desc": "A group of neuromuscular disorders caused by loss of motor neurons in the spinal cord.", "symptoms": ["muscle weakness", "hypotonia", "respiratory failure", "difficulty swallowing", "scoliosis"], "genes": ["SMN1", "SMN2"]},
    {"name": "Hereditary Angioedema", "orpha": "ORPHA:91378", "icd10": "D84.1", "category": "Immunological", "prevalence": "1:50,000", "inheritance": "Autosomal dominant", "onset": "Childhood/Adolescence", "desc": "A disorder causing recurrent episodes of severe swelling.", "symptoms": ["facial swelling", "abdominal pain", "laryngeal edema", "limb swelling", "nausea"], "genes": ["SERPING1"]},
]

FIRST_NAMES_M = ["James", "Liam", "Noah", "Oliver", "Ethan", "Amir", "Carlos", "Hiroshi", "Raj", "Marco", "Stefan", "Ahmed", "Chen", "David", "Felix"]
FIRST_NAMES_F = ["Emma", "Olivia", "Ava", "Sophia", "Mia", "Fatima", "Maria", "Yuki", "Priya", "Elena", "Anna", "Layla", "Wei", "Sarah", "Isla"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Garcia", "Müller", "Patel", "Tanaka", "Kim", "Silva", "Rossi", "Dubois", "Johansson", "Andersen", "Kumar", "Chen", "Nakamura", "O'Brien", "Martinez", "Weber"]
ETHNICITIES = ["Caucasian", "African American", "Hispanic/Latino", "East Asian", "South Asian", "Middle Eastern", "Pacific Islander", "Mixed/Other"]
CITIES = [
    ("London", "United Kingdom"), ("New York", "United States"), ("Paris", "France"),
    ("Berlin", "Germany"), ("Rome", "Italy"), ("Tokyo", "Japan"),
    ("Mumbai", "India"), ("Melbourne", "Australia"), ("Toronto", "Canada"),
    ("São Paulo", "Brazil"), ("Stockholm", "Sweden"), ("Seoul", "South Korea"),
]


async def seed():
    """Populate the database with sample data."""
    await init_db()

    async with async_session_factory() as db:
        # Check if already seeded
        from sqlalchemy import select, func
        count = (await db.execute(select(func.count(Hospital.id)))).scalar()
        if count and count > 0:
            print("Database already seeded. Skipping.")
            return

        print("🌱 Seeding database...")

        # ── Hospitals ──
        hospital_objs = []
        for h in HOSPITALS:
            hospital = Hospital(
                id=str(uuid.uuid4()),
                name=h["name"],
                code=h["code"],
                city=h["city"],
                state=h["state"],
                country=h["country"],
                data_sharing_status=h["status"],
                contact_email=h["email"],
                total_contributions=random.randint(5, 50),
                description=f"Leading research hospital specializing in rare disease diagnosis and treatment.",
            )
            db.add(hospital)
            hospital_objs.append(hospital)
        await db.flush()
        print(f"  ✅ Created {len(hospital_objs)} hospitals")

        # ── Admin User ──
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@raredisease.org",
            full_name="System Administrator",
            hashed_password=hash_password("admin123"),
            role=UserRole.ADMIN,
            hospital_id=hospital_objs[0].id,
        )
        db.add(admin)

        # ── Researcher & Clinician users ──
        users = [admin]
        researcher_names = [("Dr. Sarah Chen", "sarah.chen@nih.gov"), ("Dr. Marco Rossi", "m.rossi@opbg.net"), ("Dr. Priya Sharma", "p.sharma@aiims.edu")]
        for name, email in researcher_names:
            u = User(
                id=str(uuid.uuid4()),
                email=email,
                full_name=name,
                hashed_password=hash_password("password123"),
                role=UserRole.RESEARCHER,
                hospital_id=random.choice(hospital_objs).id,
            )
            db.add(u)
            users.append(u)

        clinician_names = [("Dr. Emily Watson", "e.watson@gosh.nhs.uk"), ("Dr. Kenji Tanaka", "k.tanaka@tmu.jp"), ("Dr. Anna Müller", "a.mueller@charite.de")]
        for name, email in clinician_names:
            u = User(
                id=str(uuid.uuid4()),
                email=email,
                full_name=name,
                hashed_password=hash_password("password123"),
                role=UserRole.CLINICIAN,
                hospital_id=random.choice(hospital_objs).id,
            )
            db.add(u)
            users.append(u)
        await db.flush()
        print(f"  ✅ Created {len(users)} users (admin: admin@raredisease.org / admin123)")

        # ── Diseases ──
        disease_objs = []
        for d in DISEASES:
            disease = Disease(
                id=str(uuid.uuid4()),
                name=d["name"],
                orpha_code=d["orpha"],
                icd10_code=d["icd10"],
                category=d["category"],
                prevalence=d["prevalence"],
                inheritance=d["inheritance"],
                age_of_onset=d["onset"],
                description=d["desc"],
                symptoms={"list": d["symptoms"]},
                genes={"list": d["genes"]},
            )
            db.add(disease)
            disease_objs.append(disease)
        await db.flush()
        print(f"  ✅ Created {len(disease_objs)} diseases")

        # ── Patients ──
        patient_objs = []
        for i in range(75):
            sex = random.choice([Sex.MALE, Sex.FEMALE])
            first_name = random.choice(FIRST_NAMES_M if sex == Sex.MALE else FIRST_NAMES_F)
            last_name = random.choice(LAST_NAMES)
            city, country = random.choice(CITIES)
            hospital = random.choice(hospital_objs)

            # Random DOB between 1950 and 2020
            start_date = date(1950, 1, 1)
            days_range = (date(2020, 12, 31) - start_date).days
            dob = start_date + timedelta(days=random.randint(0, days_range))

            patient = Patient(
                id=str(uuid.uuid4()),
                mrn=f"MRN-{hospital.code}-{str(i+1).zfill(5)}",
                first_name=first_name,
                last_name=last_name,
                date_of_birth=dob,
                sex=sex,
                ethnicity=random.choice(ETHNICITIES),
                address_city=city,
                address_country=country,
                hospital_id=hospital.id,
                phone=f"+1-555-{random.randint(100,999)}-{random.randint(1000,9999)}",
                email=f"{first_name.lower()}.{last_name.lower()}{random.randint(1,99)}@email.com",
            )
            db.add(patient)
            patient_objs.append(patient)
        await db.flush()
        print(f"  ✅ Created {len(patient_objs)} patients")

        # ── Diagnoses ──
        diagnosis_objs = []
        for patient in patient_objs:
            # Each patient gets 1-3 diagnoses
            num_diagnoses = random.choices([1, 2, 3], weights=[60, 30, 10])[0]
            assigned_diseases = random.sample(disease_objs, min(num_diagnoses, len(disease_objs)))

            for disease in assigned_diseases:
                genes = disease.genes.get("list", []) if disease.genes else []
                variant = None
                test_type = None
                if genes and random.random() > 0.3:
                    gene = random.choice(genes)
                    variant = f"{gene}:c.{random.randint(100,9999)}{random.choice(['A>G','C>T','G>A','T>C','del','ins','dup'])}"
                    test_type = random.choice(["Whole Exome Sequencing", "Targeted Gene Panel", "Whole Genome Sequencing", "Sanger Sequencing"])

                diag_date = patient.date_of_birth + timedelta(days=random.randint(365, 365*30))
                if diag_date > date.today():
                    diag_date = date.today() - timedelta(days=random.randint(30, 365*3))

                diagnosis = Diagnosis(
                    id=str(uuid.uuid4()),
                    patient_id=patient.id,
                    disease_id=disease.id,
                    diagnosed_date=diag_date,
                    status=random.choice(list(DiagnosisStatus)),
                    genetic_variant=variant,
                    genetic_test_type=test_type,
                    notes=f"Diagnosed at {random.choice([h.name for h in hospital_objs])}." if random.random() > 0.5 else None,
                )
                db.add(diagnosis)
                diagnosis_objs.append(diagnosis)
        await db.flush()
        print(f"  ✅ Created {len(diagnosis_objs)} diagnoses")

        # ── Contributions ──
        contribution_objs = []
        for _ in range(40):
            hospital = random.choice(hospital_objs)
            contributor = random.choice(users)
            submitted = datetime.now(timezone.utc) - timedelta(days=random.randint(1, 365))
            status_val = random.choice(list(ContributionStatus))
            reviewed = submitted + timedelta(days=random.randint(1, 14)) if status_val in (ContributionStatus.APPROVED, ContributionStatus.REJECTED) else None

            contribution = Contribution(
                id=str(uuid.uuid4()),
                hospital_id=hospital.id,
                contributor_id=contributor.id,
                record_type=random.choice(list(RecordType)),
                record_count=random.randint(1, 500),
                status=status_val,
                description=f"Batch upload of {random.choice(['patient demographics', 'genetic test results', 'clinical observations', 'diagnostic reports'])}.",
                submitted_at=submitted,
                reviewed_at=reviewed,
            )
            db.add(contribution)
            contribution_objs.append(contribution)
        await db.flush()
        print(f"  ✅ Created {len(contribution_objs)} contributions")

        # ── FHIR Resources (for first 20 patients) ──
        fhir_count = 0
        for patient in patient_objs[:20]:
            fhir_patient = FHIRResource(
                id=str(uuid.uuid4()),
                resource_type="Patient",
                fhir_id=patient.id,
                patient_id=patient.id,
                payload=generate_fhir_patient(patient),
            )
            db.add(fhir_patient)
            fhir_count += 1

        for diag in diagnosis_objs[:30]:
            disease = next((d for d in disease_objs if d.id == diag.disease_id), None)
            if disease:
                fhir_condition = FHIRResource(
                    id=str(uuid.uuid4()),
                    resource_type="Condition",
                    fhir_id=diag.id,
                    patient_id=diag.patient_id,
                    payload=generate_fhir_condition(diag, disease.name),
                )
                db.add(fhir_condition)
                fhir_count += 1
        await db.flush()
        print(f"  ✅ Created {fhir_count} FHIR resources")

        # ── Audit Logs ──
        actions = ["login", "view", "create", "update", "export", "search"]
        resource_types = ["patient", "disease", "diagnosis", "contribution", "fhir_resource"]
        for _ in range(60):
            import hashlib, json
            ts = datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 720))
            log_data = {"action": random.choice(actions), "ts": ts.isoformat()}
            tx_hash = "0x" + hashlib.sha256(json.dumps(log_data, default=str).encode()).hexdigest()

            audit = AuditLog(
                id=str(uuid.uuid4()),
                user_id=random.choice(users).id,
                action=random.choice(actions),
                resource_type=random.choice(resource_types),
                resource_id=str(uuid.uuid4()),
                details={"ip": f"192.168.{random.randint(1,255)}.{random.randint(1,255)}"},
                tx_hash=tx_hash,
                timestamp=ts,
            )
            db.add(audit)
        await db.flush()
        print(f"  ✅ Created 60 audit log entries")

        await db.commit()
        print("\n🎉 Database seeded successfully!")
        print("   Login credentials:")
        print("   Admin:      admin@raredisease.org / admin123")
        print("   Researcher: sarah.chen@nih.gov / password123")
        print("   Clinician:  e.watson@gosh.nhs.uk / password123")


if __name__ == "__main__":
    asyncio.run(seed())
