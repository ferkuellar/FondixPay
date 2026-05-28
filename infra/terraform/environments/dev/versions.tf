terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state is bootstrapped separately in infra/terraform/backend.
  # To use it, create a local backend config file or pass -backend-config values
  # during terraform init. Keeping this commented lets dev run locally first.
  #
  # backend "s3" {}
}

