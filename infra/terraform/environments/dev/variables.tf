variable "aws_region" {
  type        = string
  description = "AWS region for dev resources."
  default     = "us-east-1"
}

variable "project_slug" {
  type        = string
  description = "Short resource naming prefix."
  default     = "fondixpay"
}

variable "environment" {
  type        = string
  description = "Active environment. AWS-1 supports dev only."
  default     = "dev"

  validation {
    condition     = var.environment == "dev"
    error_message = "AWS-1 only supports environment=dev."
  }
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for dev VPC."
  default     = "10.42.0.0/16"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for dev public subnet."
  default     = "10.42.1.0/24"
}

variable "availability_zone" {
  type        = string
  description = "Single AZ for low-cost dev subnet."
  default     = "us-east-1a"
}

variable "create_artifacts_bucket" {
  type        = bool
  description = "Create a low-cost S3 bucket for dev artifacts/log backups."
  default     = true
}

variable "artifacts_bucket_name" {
  type        = string
  description = "Globally unique S3 bucket name for dev artifacts."
}

variable "enable_compute" {
  type        = bool
  description = "Create optional EC2 dev backend host. Defaults false to avoid accidental spend."
  default     = false
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type when enable_compute=true."
  default     = "t4g.micro"
}

variable "cpu_architecture" {
  type        = string
  description = "arm64 for t4g.micro or x86_64 for t3.micro."
  default     = "arm64"
}

variable "key_name" {
  type        = string
  description = "Optional EC2 key pair name."
  default     = null
}

variable "allowed_ssh_cidrs" {
  type        = list(string)
  description = "CIDRs allowed for SSH. Keep empty unless a short-lived dev host is needed."
  default     = []
}

variable "allowed_backend_cidrs" {
  type        = list(string)
  description = "CIDRs allowed for direct backend access. Keep empty by default."
  default     = []
}

variable "backend_port" {
  type        = number
  description = "Dev backend port."
  default     = 8000
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch log retention. Cost guardrail: max 7 days."
  default     = 7
}

variable "monthly_budget_limit_usd" {
  type        = number
  description = "Monthly budget ceiling used for alert threshold calculations."
  default     = 50
}

variable "budget_alert_thresholds_usd" {
  type        = list(number)
  description = "Absolute USD alert points."
  default     = [20, 30, 50]
}

variable "budget_alert_emails" {
  type        = list(string)
  description = "Budget alert email recipients."
}

