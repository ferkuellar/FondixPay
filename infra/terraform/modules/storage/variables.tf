variable "create_bucket" {
  type        = bool
  description = "Whether to create a dev artifacts bucket."
  default     = true
}

variable "bucket_name" {
  type        = string
  description = "Globally unique S3 bucket name for dev artifacts/log backups."
}

variable "expiration_days" {
  type        = number
  description = "Days before expiring current dev artifacts."
  default     = 30
}

variable "noncurrent_version_expiration_days" {
  type        = number
  description = "Days before expiring non-current artifact object versions."
  default     = 7
}

variable "tags" {
  type        = map(string)
  description = "Common tags."
}

