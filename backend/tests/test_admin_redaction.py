from app.modules.admin.redaction import (
    mask_email,
    mask_phone,
    redact_provider_reference,
    redact_sensitive_dict,
)


def test_redaction_hides_sensitive_dictionary_keys() -> None:
    redacted = redact_sensitive_dict(
        {
            "card_token": "tok_demo",
            "pan": "4111111111111111",
            "nested": {"secret_key": "hidden", "provider_reference": "safe"},
        }
    )

    assert "card_token" not in redacted
    assert "pan" not in redacted
    assert "secret_key" not in redacted["nested"]
    assert redacted["nested"]["provider_reference"] == "safe"


def test_role_safe_masks_keep_only_operational_context() -> None:
    assert mask_phone("5512345678") == "******5678"
    assert mask_email("operador@fondix.test") == "o*******@fondix.test"
    assert redact_provider_reference("SUPPORT", "PROVIDER-ABC-1234").endswith("1234")
    assert redact_provider_reference("FINANCE", "PROVIDER-ABC-1234") == "PROVIDER-ABC-1234"
