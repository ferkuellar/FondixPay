resource "aws_budgets_budget" "monthly_cost" {
  name         = "${var.name_prefix}-monthly-cost-budget"
  budget_type  = "COST"
  limit_amount = var.monthly_limit_usd
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
  tags         = var.tags

  cost_filter {
    name = "TagKeyValue"
    values = [
      "Project$FondixPay",
    ]
  }

  dynamic "notification" {
    for_each = var.alert_thresholds_usd
    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value / var.monthly_limit_usd * 100
      threshold_type             = "PERCENTAGE"
      notification_type          = "ACTUAL"
      subscriber_email_addresses = var.alert_emails
    }
  }
}
