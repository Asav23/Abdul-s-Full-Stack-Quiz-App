# Least-privilege instance role: it can pull images from ECR and be reached
# via SSM Session Manager, nothing else. If the box were ever compromised,
# these are the only two things it's trusted to do.
resource "aws_iam_role" "app" {
  name = "quizzer-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })

  tags = { Project = "quizzer" }
}

resource "aws_iam_role_policy_attachment" "ecr_readonly" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# Lets you get a shell on the instance via the AWS console / CLI with no
# inbound SSH port open at all.
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "app" {
  name = "quizzer-app-profile"
  role = aws_iam_role.app.name
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.app.id]
  iam_instance_profile   = aws_iam_instance_profile.app.name

  # Forces IMDSv2 (token-required metadata requests). Blocks the SSRF-based
  # credential theft technique that stole IAM credentials via the metadata
  # service in the 2019 Capital One breach.
  metadata_options {
    http_tokens   = "required"
    http_endpoint = "enabled"
  }

  root_block_device {
    volume_size = 30 # AL2023's snapshot requires >= 30GB; also exactly the EBS free-tier limit
    volume_type = "gp3"
    encrypted   = true # free - AWS-managed default KMS key
  }

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    aws_region         = var.aws_region
    backend_repo_url   = aws_ecr_repository.backend.repository_url
    frontend_repo_url  = aws_ecr_repository.frontend.repository_url
    backend_image_tag  = var.backend_image_tag
    frontend_image_tag = var.frontend_image_tag
    db_endpoint        = aws_db_instance.quizzer.address
    db_name            = var.db_name
    db_username        = var.db_username
    db_password        = random_password.db.result
  })

  tags = { Project = "quizzer", Name = "quizzer-app" }
}

# Fixed public IP - free as long as it stays attached to a running instance.
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"
  tags     = { Project = "quizzer" }
}
