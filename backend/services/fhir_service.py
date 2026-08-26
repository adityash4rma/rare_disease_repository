"""
FHIR service - Generates FHIR R4 resource representations from internal data.
"""

import uuid
from datetime import datetime, timezone

from backend.models.patient import Patient
from backend.models.diagnosis import Diagnosis


def generate_fhir_patient(patient: Patient) -> dict:
    """Generate a FHIR R4 Patient resource from an internal Patient model."""
    resource = {
        "resourceType": "Patient",
        "id": patient.id,
        "meta": {
            "versionId": "1",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
        },
        "identifier": [
            {
                "use": "usual",
                "type": {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                            "code": "MR",
                            "display": "Medical Record Number",
                        }
                    ]
                },
                "value": patient.mrn,
            }
        ],
        "active": True,
        "name": [
            {
                "use": "official",
                "family": patient.last_name,
                "given": [patient.first_name],
            }
        ],
        "gender": _map_sex_to_fhir(patient.sex.value if patient.sex else "unknown"),
        "birthDate": patient.date_of_birth.isoformat() if patient.date_of_birth else None,
    }

    if patient.phone:
        resource["telecom"] = [{"system": "phone", "value": patient.phone, "use": "home"}]
    if patient.email:
        resource.setdefault("telecom", []).append(
            {"system": "email", "value": patient.email}
        )
    if patient.address_city or patient.address_country:
        resource["address"] = [
            {
                "city": patient.address_city,
                "country": patient.address_country,
            }
        ]

    return resource


def generate_fhir_condition(diagnosis: Diagnosis, disease_name: str) -> dict:
    """Generate a FHIR R4 Condition resource from a Diagnosis."""
    resource = {
        "resourceType": "Condition",
        "id": diagnosis.id,
        "meta": {
            "versionId": "1",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
        },
        "clinicalStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    "code": _map_status_to_fhir(diagnosis.status.value),
                }
            ]
        },
        "verificationStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    "code": "confirmed" if diagnosis.status.value == "confirmed" else "provisional",
                }
            ]
        },
        "code": {
            "coding": [],
            "text": disease_name,
        },
        "subject": {"reference": f"Patient/{diagnosis.patient_id}"},
    }

    if diagnosis.diagnosed_date:
        resource["onsetDateTime"] = diagnosis.diagnosed_date.isoformat()

    if diagnosis.notes:
        resource["note"] = [{"text": diagnosis.notes}]

    return resource


def generate_fhir_observation(
    patient_id: str,
    observation_type: str,
    value: str,
    observation_id: str = None,
) -> dict:
    """Generate a FHIR R4 Observation resource."""
    return {
        "resourceType": "Observation",
        "id": observation_id or str(uuid.uuid4()),
        "meta": {
            "versionId": "1",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
        },
        "status": "final",
        "code": {
            "coding": [
                {
                    "system": "http://loinc.org",
                    "display": observation_type,
                }
            ],
            "text": observation_type,
        },
        "subject": {"reference": f"Patient/{patient_id}"},
        "valueString": value,
    }


def _map_sex_to_fhir(sex: str) -> str:
    """Map internal sex values to FHIR gender codes."""
    mapping = {
        "male": "male",
        "female": "female",
        "other": "other",
        "unknown": "unknown",
    }
    return mapping.get(sex.lower(), "unknown")


def _map_status_to_fhir(status: str) -> str:
    """Map diagnosis status to FHIR clinical status."""
    mapping = {
        "suspected": "active",
        "confirmed": "active",
        "ruled_out": "inactive",
        "in_remission": "remission",
    }
    return mapping.get(status, "active")
