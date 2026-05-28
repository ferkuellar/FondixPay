output "cloudwatch_log_group_name" {
  description = "CloudWatch log group for backend dev host/cloud-init logs."
  value       = aws_cloudwatch_log_group.backend.name
}

output "instance_id" {
  description = "Optional dev backend EC2 instance id."
  value       = var.enable_compute ? aws_instance.backend[0].id : null
}

output "public_ip" {
  description = "Optional dev backend public IP."
  value       = var.enable_compute ? aws_instance.backend[0].public_ip : null
}

output "security_group_id" {
  description = "Optional backend security group id."
  value       = var.enable_compute ? aws_security_group.backend[0].id : null
}

