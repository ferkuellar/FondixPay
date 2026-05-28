output "budget_name" {
  description = "AWS Budget name."
  value       = aws_budgets_budget.monthly_cost.name
}

output "alert_thresholds_usd" {
  description = "Budget alert thresholds in USD."
  value       = var.alert_thresholds_usd
}

