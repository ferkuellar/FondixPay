variable "name_prefix" {
  type        = string
  description = "Name prefix for budget resources."
}

variable "monthly_limit_usd" {
  type        = number
  description = "Monthly budget limit in USD."
  default     = 50
}

variable "alert_thresholds_usd" {
  type        = list(number)
  description = "Absolute USD alert points converted to percentage thresholds."
  default     = [20, 30, 50]
}

variable "alert_emails" {
  type        = list(string)
  description = "Email recipients for AWS Budget alerts."

  validation {
    condition     = length(var.alert_emails) > 0
    error_message = "At least one budget alert email is required."
  }
}

variable "tags" {
  type        = map(string)
  description = "Common tags applied to budget resources when supported."
}
