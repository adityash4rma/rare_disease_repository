"""
Audit service - Creates audit log entries with optional blockchain-style hashing.
"""

import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.audit_log import AuditLog


def _generate_tx_hash(data: dict) -> str:
    """Generate a deterministic hash simulating a blockchain transaction hash."""
    serialized = json.dumps(data, sort_keys=True, default=str)
    return "0x" + hashlib.sha256(serialized.encode()).hexdigest()


async def create_audit_log(
    db: AsyncSession,
    user_id: Optional[str],
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    details: Optional[dict] = None,
    ip_address: Optional[str] = None,
) -> AuditLog:
    """Create an audit log entry with a blockchain-style transaction hash."""
    log_data = {
        "user_id": user_id,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    tx_hash = _generate_tx_hash(log_data)

    audit_log = AuditLog(
        id=str(uuid.uuid4()),
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address,
        tx_hash=tx_hash,
    )
    db.add(audit_log)
    return audit_log
