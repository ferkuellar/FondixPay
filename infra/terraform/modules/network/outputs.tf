output "vpc_id" {
  description = "Dev VPC id."
  value       = aws_vpc.this.id
}

output "public_subnet_id" {
  description = "Public subnet id for optional dev compute."
  value       = aws_subnet.public.id
}

output "internet_gateway_id" {
  description = "Internet gateway id. No NAT Gateway is created."
  value       = aws_internet_gateway.this.id
}

