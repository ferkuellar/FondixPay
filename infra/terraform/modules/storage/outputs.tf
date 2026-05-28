output "bucket_name" {
  description = "Dev artifacts bucket name, if created."
  value       = var.create_bucket ? aws_s3_bucket.artifacts[0].bucket : null
}

output "bucket_arn" {
  description = "Dev artifacts bucket ARN, if created."
  value       = var.create_bucket ? aws_s3_bucket.artifacts[0].arn : null
}

