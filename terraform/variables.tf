variable "aws_region" {
  description = "AWS region to deploy into. Must be a region where the t2.micro / db.t3.micro free tier is available."
  type        = string
  default     = "eu-west-1"
}

variable "instance_type" {
  description = "EC2 instance type for the app box. Confirmed via `aws ec2 describe-instance-types --filters Name=free-tier-eligible,Values=true` that this account's free tier uses t3.micro, not the classic t2.micro."
  type        = string
  default     = "t3.micro"
}

variable "db_instance_class" {
  description = "RDS instance class. Free tier covers db.t3.micro / db.t4g.micro for 750 hours/month."
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Postgres database name."
  type        = string
  default     = "quizdb"
}

variable "db_username" {
  description = "Postgres master username."
  type        = string
  default     = "quizadmin"
}

variable "budget_alert_email" {
  description = "Email address to receive the budget alert/warning notifications."
  type        = string
}

variable "budget_limit_usd" {
  description = "Monthly cost threshold (USD) that triggers the alert email and the automatic EC2 stop action."
  type        = string
  default     = "1"
}

variable "backend_image_tag" {
  description = "Tag of the backend image in ECR to deploy to the instance."
  type        = string
  default     = "latest"
}

variable "frontend_image_tag" {
  description = "Tag of the frontend image in ECR to deploy to the instance."
  type        = string
  default     = "latest"
}
