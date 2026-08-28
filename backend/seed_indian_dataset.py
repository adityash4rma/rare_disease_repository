"""
Seeder script to ingest the 10,000 Indian Rare Disease Dataset into the SQLite database.
Replaces demo data with real clinical records from database/indian_rare_disease_10000_dataset.xlsx.
"""

import asyncio
import os
import random
import sys
import uuid
from datetime import date, datetime, timedelta, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import pandas as pd
from sqlalchemy import select, delete

from backend.database import async_session_factory, engine, Base
from backend.models.user import User, UserRole
from backend.models.hospital import Hospital, DataSharingStatus
from backend.models.disease import Disease
from backend.models.patient import Patient, Sex
from backend.models.diagnosis import Diagnosis, DiagnosisStatus
from backend.models.fhir_resource import FHIRResource
from backend.models.contribution import Contribution, ContributionStatus, RecordType
from backend.models.audit_log import AuditLog
from backend.auth.security import hash_password
from backend.services.audit_service import _generate_tx_hash

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "indian_rare_disease_10000_dataset.xlsx")

# State to Hospital mapping (Indian Centers of Excellence)
STATE_HOSPITAL_MAP = {
    "Delhi NCR": {
        "name": "All India Institute of Medical Sciences (AIIMS)",
        "code": "AIIMS-DEL",
        "city": "New Delhi",
        "state": "Delhi NCR",
        "zone": "North"
    },
    "Uttar Pradesh": {
        "name": "Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGI)",
        "code": "SGPGI-LKO",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "zone": "North"
    },
    "Tamil Nadu": {
        "name": "Christian Medical College (CMC) Vellore",
        "code": "CMC-VEL",
        "city": "Vellore",
        "state": "Tamil Nadu",
        "zone": "South"
    },
    "Karnataka": {
        "name": "National Institute of Mental Health and Neurosciences (NIMHANS)",
        "code": "NIMHANS-BLR",
        "city": "Bengaluru",
        "state": "Karnataka",
        "zone": "South"
    },
    "Kerala": {
        "name": "Government Medical College Thiruvananthapuram",
        "code": "GMC-TVM",
        "city": "Thiruvananthapuram",
        "state": "Kerala",
        "zone": "South"
    },
    "Maharashtra": {
        "name": "Tata Memorial Centre & KEM Hospital",
        "code": "TMC-MUM",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zone": "West"
    },
    "Gujarat": {
        "name": "Gujarat Cancer & Research Institute (GCRI)",
        "code": "GCRI-AHM",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "zone": "West"
    },
    "West Bengal": {
        "name": "Institute of Post Graduate Medical Education & Research (IPGMER)",
        "code": "IPGMER-KOL",
        "city": "Kolkata",
        "state": "West Bengal",
        "zone": "East"
    }
}

DISEASE_METADATA = {
    "Wilson Disease": {
        "orpha_code": "ORPHA:905",
        "icd10_code": "E83.0",
        "category": "Metabolic / Hepatic",
        "prevalence": "1:30,000 in India",
        "inheritance": "Autosomal recessive",
        "age_of_onset": "Childhood/Adult (5-35 yrs)",
        "description": "Autosomal recessive disorder of copper metabolism caused by mutations in ATP7B, leading to toxic hepatic and neurologic copper accumulation.",
        "symptoms": {"list": ["Kayser-Fleischer rings", "hepatosplenomegaly", "tremor", "dystonia", "jaundice", "dysarthria"]},
        "genes": {"list": ["ATP7B"]}
    },
    "Spinal Muscular Atrophy (SMA)": {
        "orpha_code": "ORPHA:70",
        "icd10_code": "G12.0",
        "category": "Neuromuscular",
        "prevalence": "1:10,000 live births",
        "inheritance": "Autosomal recessive",
        "age_of_onset": "Infancy to Childhood",
        "description": "Severe neuromuscular disease characterized by degeneration of spinal cord alpha motor neurons caused by homozygous SMN1 gene deletion.",
        "symptoms": {"list": ["progressive proximal muscle weakness", "hypotonia", "areflexia", "respiratory insufficiency", "bell-shaped chest"]},
        "genes": {"list": ["SMN1", "SMN2"]}
    },
    "Alkaptonuria": {
        "orpha_code": "ORPHA:58",
        "icd10_code": "E70.2",
        "category": "Metabolic / Inborn Error",
        "prevalence": "1:250,000",
        "inheritance": "Autosomal recessive",
        "age_of_onset": "Infancy (dark urine) to Adult (ochronosis)",
        "description": "Inborn error of tyrosine catabolism caused by homogentisate 1,2-dioxygenase (HGD) deficiency, causing ochronotic arthritis and dark urine.",
        "symptoms": {"list": ["dark urine turning black on standing", "ochronotic pigmentation of sclera/ears", "severe spondyloarthropathy", "aortic stenosis"]},
        "genes": {"list": ["HGD"]}
    },
    "Gaucher Disease Type 1": {
        "orpha_code": "ORPHA:355",
        "icd10_code": "E75.2",
        "category": "Lysosomal Storage",
        "prevalence": "1:40,000",
        "inheritance": "Autosomal recessive",
        "age_of_onset": "Variable (Childhood to Adult)",
        "description": "Lysosomal storage disease resulting from glucocerebrosidase (GBA) deficiency, causing lipid engorgement in macrophages.",
        "symptoms": {"list": ["splenomegaly", "hepatomegaly", "thrombocytopenia", "Erlenmeyer flask bone deformity", "bone crises", "anemia"]},
        "genes": {"list": ["GBA"]}
    }
}

INDIAN_FIRST_NAMES_M = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Atharva", "Advik", "Pranav", "Advaith", "Kabir", "Anay", "Rohan", "Kartik", "Kavish",
    "Devansh", "Laksh", "Dhruv", "Samar", "Tejas", "Tanmay", "Aayush", "Ayushman", "Madhav", "Manish"
]
INDIAN_FIRST_NAMES_F = [
    "Saanvi", "Aanya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Anika", "Navya", "Diya", "Avani",
    "Myra", "Sara", "Ira", "Riya", "Sneha", "Kavya", "Ahana", "Prisha", "Khushi", "Meera",
    "Swara", "Anvi", "Aditi", "Vanya", "Shanaya", "Trisha", "Ishita", "Anokhi", "Pooja", "Deepika"
]
INDIAN_LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Iyer", "Nair", "Kulkarni", "Mukherjee", "Banerjee", "Reddy", "Rao",
    "Gupta", "Mishra", "Singh", "Kumar", "Bose", "Choudhury", "Pillai", "Menon", "Joshi", "Deshmukh",
    "Mehta", "Shah", "Gowda", "Hegde", "Bhat", "Chauhan", "Yadav", "Pandey", "Chatterjee", "Sen"
]


async def seed_indian_dataset():
    print("Ingesting 10,000 Indian Rare Disease Dataset into Database...")
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset file not found at: {DATASET_PATH}")

    df = pd.read_excel(DATASET_PATH)
    print(f"Loaded {len(df)} rows from Excel dataset.")

    async with engine.begin() as conn:
        # Recreate schema to guarantee clean slate
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Reset database schema cleanly.")

    async with async_session_factory() as db:
        # 1. Seed Indian Hospitals / Centers of Excellence
        hospitals_by_state = {}
        for state, info in STATE_HOSPITAL_MAP.items():
            hosp = Hospital(
                name=info["name"],
                code=info["code"],
                city=info["city"],
                state=info["state"],
                country="India",
                data_sharing_status=DataSharingStatus.ACTIVE,
                contact_email=f"contact@{info['code'].lower()}.gov.in",
                contact_phone="+91-11-26588500",
                total_contributions=len(df[df["State_of_Origin"] == state]),
                description=f"Apex Indian Rare Disease Center of Excellence ({info['zone']} Zone)."
            )
            db.add(hosp)
            hospitals_by_state[state] = hosp
        await db.flush()
        print(f"Registered {len(hospitals_by_state)} Indian Centers of Excellence.")

        # 2. Seed Users
        users = [
            User(
                email="admin@raredisease.org",
                hashed_password=hash_password("admin123"),
                full_name="National Registry Administrator",
                role=UserRole.ADMIN,
                is_active=True,
            ),
            User(
                email="dr.sharma@aiims.edu",
                hashed_password=hash_password("password123"),
                full_name="Dr. Aarav Sharma, MD (Genetics)",
                role=UserRole.CLINICIAN,
                hospital_id=hospitals_by_state["Delhi NCR"].id,
                is_active=True,
            ),
            User(
                email="dr.iyer@cmc.edu",
                hashed_password=hash_password("password123"),
                full_name="Dr. Priya Iyer, PhD",
                role=UserRole.RESEARCHER,
                hospital_id=hospitals_by_state["Tamil Nadu"].id,
                is_active=True,
            ),
            User(
                email="dr.kulkarni@nimhans.edu",
                hashed_password=hash_password("password123"),
                full_name="Dr. Rajesh Kulkarni, DM",
                role=UserRole.CLINICIAN,
                hospital_id=hospitals_by_state["Karnataka"].id,
                is_active=True,
            ),
        ]
        for u in users:
            db.add(u)
        await db.flush()
        print(f"Seeded {len(users)} clinical and administrative users.")

        # 3. Seed Rare Diseases
        diseases_map = {}
        for disease_name, meta in DISEASE_METADATA.items():
            dis = Disease(
                name=disease_name,
                orpha_code=meta["orpha_code"],
                icd10_code=meta["icd10_code"],
                category=meta["category"],
                prevalence=meta["prevalence"],
                inheritance=meta["inheritance"],
                age_of_onset=meta["age_of_onset"],
                description=meta["description"],
                symptoms=meta["symptoms"],
                genes=meta["genes"]
            )
            db.add(dis)
            diseases_map[disease_name] = dis
        await db.flush()
        print(f"Seeded {len(diseases_map)} rare disease catalog entries.")

        # 4. Seed Patients & Diagnoses from Excel
        grouped_patients = df.groupby("Patient_ID")
        print(f"Processing {len(grouped_patients)} unique patient cohorts...")

        patient_objects = {}
        diagnoses_to_add = []
        random.seed(42)

        for p_id, group in grouped_patients:
            first_row = group.iloc[0]
            gender_val = str(first_row["Gender"]).strip()
            sex_enum = Sex.MALE if gender_val.lower() == "male" else Sex.FEMALE
            state_val = str(first_row["State_of_Origin"]).strip()
            hospital = hospitals_by_state.get(state_val)

            first_name = random.choice(INDIAN_FIRST_NAMES_M if sex_enum == Sex.MALE else INDIAN_FIRST_NAMES_F)
            last_name = random.choice(INDIAN_LAST_NAMES)

            age_yrs = float(first_row.get("Age_At_Visit_Years", 20.0))
            dob = date.today() - timedelta(days=int(age_yrs * 365.25))

            patient = Patient(
                mrn=str(p_id),
                first_name=first_name,
                last_name=last_name,
                date_of_birth=dob,
                sex=sex_enum,
                ethnicity=f"{first_row.get('Geographical_Zone', 'India')} Zone",
                address_city=state_val,
                address_country="India",
                phone=f"+91-98{random.randint(10000000, 99999999)}",
                email=f"{first_name.lower()}.{last_name.lower()}{random.randint(10, 99)}@patient-portal.in",
                hospital_id=hospital.id if hospital else None,
                notes=(
                    f"Socioeconomic: {first_row.get('Socioeconomic_Status')} | "
                    f"Onset: {first_row.get('Age_at_Onset_Years')}y | "
                    f"Diag Delay: {first_row.get('Diagnostic_Delay_Months')} mos | "
                    f"Settlement: {first_row.get('Geographic_Settlement')}"
                )
            )
            db.add(patient)
            patient_objects[p_id] = patient

            dis_name = str(first_row.get("Rare_Disease_Name")).strip()
            dis_obj = diseases_map.get(dis_name)
            if dis_obj:
                diag = Diagnosis(
                    patient=patient,
                    disease=dis_obj,
                    diagnosed_date=date.today() - timedelta(days=int(float(first_row.get("Diagnostic_Delay_Months", 12)) * 30)),
                    status=DiagnosisStatus.CONFIRMED,
                    genetic_variant=f"{first_row.get('Mutated_Gene')} ({first_row.get('Mutation_Type')})",
                    genetic_test_type="Next-Generation Sequencing (NGS) / MLPA",
                    notes=(
                        f"Prescribed Drug: {first_row.get('Prescribed_Orphan_Drug')} | "
                        f"Funding: {first_row.get('Treatment_Funding_Source')} | "
                        f"Adherence: {first_row.get('Medication_Adherence_Rate_Pct')}% | "
                        f"AQI Exposure: {first_row.get('Avg_AQI_Exposure')} | "
                        f"Outcome: {first_row.get('Clinical_Outcome_Target')}"
                    )
                )
                diagnoses_to_add.append(diag)

        await db.flush()
        print(f"Created {len(patient_objects)} unique patient records.")

        for d in diagnoses_to_add:
            db.add(d)
        await db.flush()
        print(f"Created {len(diagnoses_to_add)} confirmed diagnoses.")

        # 5. Seed FHIR Resources (sample 1,000 rich FHIR R4 JSON payloads from visits)
        fhir_entries = []
        sample_rows = df.head(1000)
        for _, row in sample_rows.iterrows():
            p_obj = patient_objects.get(row["Patient_ID"])
            if not p_obj:
                continue

            obs_payload = {
                "resourceType": "Observation",
                "id": str(uuid.uuid4()),
                "status": "final",
                "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "laboratory"}]}],
                "code": {
                    "coding": [{"system": "http://loinc.org", "code": "CUSTOM-BIOMARKER", "display": str(row.get("Specialized_Biomarker_Name"))}],
                    "text": str(row.get("Specialized_Biomarker_Name"))
                },
                "subject": {"reference": f"Patient/{p_obj.id}", "display": f"{p_obj.first_name} {p_obj.last_name}"},
                "valueQuantity": {
                    "value": float(row.get("Biomarker_Value", 0.0)),
                    "unit": str(row.get("Biomarker_Unit", ""))
                },
                "component": [
                    {"code": {"text": "Systolic BP"}, "valueQuantity": {"value": int(row.get("Systolic_BP_mmHg", 120)), "unit": "mmHg"}},
                    {"code": {"text": "Diastolic BP"}, "valueQuantity": {"value": int(row.get("Diastolic_BP_mmHg", 80)), "unit": "mmHg"}},
                    {"code": {"text": "Hemoglobin"}, "valueQuantity": {"value": float(row.get("Hemoglobin_g_dL", 13.0)), "unit": "g/dL"}},
                    {"code": {"text": "Serum Creatinine"}, "valueQuantity": {"value": float(row.get("Serum_Creatinine_mg_dL", 1.0)), "unit": "mg/dL"}},
                    {"code": {"text": "ALT"}, "valueQuantity": {"value": int(row.get("ALT_U_L", 25)), "unit": "U/L"}},
                    {"code": {"text": "AST"}, "valueQuantity": {"value": int(row.get("AST_U_L", 25)), "unit": "U/L"}},
                    {"code": {"text": "Clinical Severity (1-10)"}, "valueQuantity": {"value": int(row.get("Clinical_Severity_Score_1_10", 5)), "unit": "score"}}
                ]
            }

            fhir_res = FHIRResource(
                resource_type="Observation",
                fhir_id=obs_payload["id"],
                patient_id=p_obj.id,
                payload=obs_payload,
                version=1,
                last_updated=datetime.now(timezone.utc)
            )
            fhir_entries.append(fhir_res)

        for f in fhir_entries:
            db.add(f)
        await db.flush()
        print(f"Generated {len(fhir_entries)} HL7 FHIR R4 clinical observation resources.")

        # 6. Seed Institutional Contributions
        for state, hosp in hospitals_by_state.items():
            state_records = len(df[df["State_of_Origin"] == state])
            contrib = Contribution(
                hospital_id=hosp.id,
                contributor_id=users[1].id,
                record_type=RecordType.PATIENT,
                record_count=state_records,
                status=ContributionStatus.APPROVED,
                description=f"Full registry upload from {hosp.name} for {state} cohort ({state_records} clinical records)."
            )
            db.add(contrib)
        await db.flush()
        print("Registered institutional data contributions.")

        # 7. Seed Audit Logs
        actions = ["login", "view", "export", "search", "create"]
        audit_entries = []
        for i in range(100):
            u = random.choice(users)
            action = random.choice(actions)
            res_type = random.choice(["patient", "disease", "fhir_resource", "contribution"])
            log_data = {
                "user_id": u.id,
                "action": action,
                "resource_type": res_type,
                "resource_id": str(uuid.uuid4()),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            tx = _generate_tx_hash(log_data)
            audit = AuditLog(
                user_id=u.id,
                action=action,
                resource_type=res_type,
                resource_id=log_data["resource_id"],
                details={"ip": f"10.5.{random.randint(1, 254)}.{random.randint(1, 254)}", "records_accessed": random.randint(1, 50)},
                tx_hash=tx,
                timestamp=datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))
            )
            audit_entries.append(audit)
            db.add(audit)

        await db.commit()
        print(f"Created {len(audit_entries)} immutable cryptographic audit log entries.")

    print("\n10,000 Indian Rare Disease Dataset successfully seeded into the database!")
    print(f"Summary:")
    print(f"   - Unique Patients: {len(patient_objects)}")
    print(f"   - Total Clinical Visits: {len(df)}")
    print(f"   - Hospitals / CoEs: {len(hospitals_by_state)}")
    print(f"   - Confirmed Diagnoses: {len(diagnoses_to_add)}")
    print(f"   - FHIR Resources: {len(fhir_entries)}")


if __name__ == "__main__":
    asyncio.run(seed_indian_dataset())
