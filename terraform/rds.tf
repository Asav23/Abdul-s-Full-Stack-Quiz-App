resource "random_password" "db" {
  length  = 20
  special = false
}

resource "aws_db_subnet_group" "quizzer" {
  name       = "quizzer-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids
  tags       = { Project = "quizzer" }
}

resource "aws_db_instance" "quizzer" {
  identifier     = "quizzer-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class

  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true # free - uses the AWS-managed default KMS key

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.quizzer.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false
  multi_az               = false

  backup_retention_period = 0 # no automated backups - app already has its own pg_dump-based backup scripts
  skip_final_snapshot     = true
  deletion_protection     = false

  tags = { Project = "quizzer" }
}
