variable "aws_region" {
  type        = string
  description = "AWS region for Terraform backend resources."
  default     = "us-east-1"
}

variable "state_bucket_name" {
  type        = string
  description = "Globally unique S3 bucket name for Terraform state."
}

variable "lock_table_name" {
  type        = string
  description = "DynamoDB table name for Terraform state locking."
  default     = "fondixpay-terraform-locks"
}

variable "noncurrent_state_retention_days" {
  type        = number
  description = "Retention period for old state object versions."
  default     = 30
}

variable "tags" {
  type        = map(string)
  description = "Common cost and ownership tags."
  default = {
    Project     = "FondixPay"
    Environment = "dev"
    Owner       = "NorthboundFinOps"
    ManagedBy   = "Terraform"
    CostControl = "strict"
  }
}

