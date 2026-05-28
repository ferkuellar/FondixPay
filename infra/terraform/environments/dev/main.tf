provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

locals {
  name_prefix = "${var.project_slug}-${var.environment}"
  common_tags = {
    Project     = "FondixPay"
    Environment = var.environment
    Owner       = "NorthboundFinOps"
    ManagedBy   = "Terraform"
    CostControl = "strict"
  }
}

module "network" {
  source = "../../modules/network"

  name_prefix        = local.name_prefix
  vpc_cidr           = var.vpc_cidr
  public_subnet_cidr = var.public_subnet_cidr
  availability_zone  = var.availability_zone
  tags               = local.common_tags
}

module "storage" {
  source = "../../modules/storage"

  create_bucket = var.create_artifacts_bucket
  bucket_name   = var.artifacts_bucket_name
  tags          = local.common_tags
}

module "compute" {
  source = "../../modules/compute"

  enable_compute        = var.enable_compute
  name_prefix           = local.name_prefix
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  public_subnet_id      = module.network.public_subnet_id
  instance_type         = var.instance_type
  cpu_architecture      = var.cpu_architecture
  key_name              = var.key_name
  allowed_ssh_cidrs     = var.allowed_ssh_cidrs
  allowed_backend_cidrs = var.allowed_backend_cidrs
  backend_port          = var.backend_port
  log_retention_days    = var.log_retention_days
  tags                  = local.common_tags
}

module "budget" {
  source = "../../modules/budget"

  name_prefix          = local.name_prefix
  monthly_limit_usd    = var.monthly_budget_limit_usd
  alert_thresholds_usd = var.budget_alert_thresholds_usd
  alert_emails         = var.budget_alert_emails
  tags                 = local.common_tags
}
