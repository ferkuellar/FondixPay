variable "enable_compute" {
  type        = bool
  description = "Whether to create the optional dev EC2 backend host."
  default     = false
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for compute resources."
}

variable "environment" {
  type        = string
  description = "Environment name."
}

variable "vpc_id" {
  type        = string
  description = "VPC id for the backend security group."
}

variable "public_subnet_id" {
  type        = string
  description = "Public subnet id for the optional dev backend host."
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for dev backend."
  default     = "t4g.micro"
}

variable "cpu_architecture" {
  type        = string
  description = "AMI CPU architecture: arm64 for t4g, x86_64 for t3."
  default     = "arm64"

  validation {
    condition     = contains(["arm64", "x86_64"], var.cpu_architecture)
    error_message = "cpu_architecture must be arm64 or x86_64."
  }
}

variable "key_name" {
  type        = string
  description = "Optional EC2 key pair name. Leave null to disable SSH key injection."
  default     = null
}

variable "allowed_ssh_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to SSH. Empty by default."
  default     = []
}

variable "allowed_backend_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to access backend_port. Empty by default."
  default     = []
}

variable "backend_port" {
  type        = number
  description = "Dev backend port to allow from approved CIDRs."
  default     = 8000
}

variable "root_volume_size_gb" {
  type        = number
  description = "Encrypted gp3 root volume size."
  default     = 12
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch log retention in days. Must stay within the cost guardrail."
  default     = 7

  validation {
    condition     = contains([3, 5, 7], var.log_retention_days)
    error_message = "log_retention_days must be 3, 5, or 7."
  }
}

variable "tags" {
  type        = map(string)
  description = "Common tags."
}

