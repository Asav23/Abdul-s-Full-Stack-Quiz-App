data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# App instance: only HTTP in from the internet. No SSH port at all -
# remote access goes through AWS Systems Manager Session Manager instead,
# which needs no open inbound port and leaves no brute-forceable attack surface.
resource "aws_security_group" "app" {
  name        = "quizzer-app-sg"
  description = "Quizzer EC2 instance: HTTP from anywhere, no SSH port (SSM Session Manager used instead)"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound (ECR pulls, SSM, package updates)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Project = "quizzer" }
}

# DB instance: Postgres reachable only from the app instance's security group,
# never from the open internet.
resource "aws_security_group" "db" {
  name        = "quizzer-db-sg"
  description = "Quizzer RDS: Postgres reachable only from the app instance"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Postgres from app instance only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Project = "quizzer" }
}
