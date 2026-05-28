variable "name_prefix" {
  type        = string
  description = "Name prefix for network resources."
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the dev VPC."
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for the single public dev subnet."
}

variable "availability_zone" {
  type        = string
  description = "Availability zone for the single public subnet."
}

variable "tags" {
  type        = map(string)
  description = "Common tags."
}

