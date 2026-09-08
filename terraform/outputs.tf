output "app_url" {
  description = "Public URL of the deployed app."
  value       = "http://${aws_eip.app.public_ip}"
}

output "ec2_public_ip" {
  value = aws_eip.app.public_ip
}

output "ec2_instance_id" {
  description = "Needed to open a shell via: aws ssm start-session --target <this-id>"
  value       = aws_instance.app.id
}

output "rds_endpoint" {
  value = aws_db_instance.quizzer.address
}

output "ecr_backend_repo_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_repo_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "db_password" {
  value     = random_password.db.result
  sensitive = true
}
