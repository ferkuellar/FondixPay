output "vpc_id" {
  description = "Dev VPC id."
  value       = module.network.vpc_id
}

output "public_subnet_id" {
  description = "Dev public subnet id."
  value       = module.network.public_subnet_id
}

output "artifacts_bucket_name" {
  description = "Dev artifacts bucket, if enabled."
  value       = module.storage.bucket_name
}

output "backend_log_group_name" {
  description = "CloudWatch log group for backend dev host/cloud-init logs."
  value       = module.compute.cloudwatch_log_group_name
}

output "backend_instance_id" {
  description = "Optional backend dev EC2 instance id."
  value       = module.compute.instance_id
}

output "backend_public_ip" {
  description = "Optional backend dev EC2 public IP."
  value       = module.compute.public_ip
}

output "budget_name" {
  description = "AWS monthly cost budget name."
  value       = module.budget.budget_name
}

