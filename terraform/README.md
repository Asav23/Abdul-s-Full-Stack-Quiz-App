# Quizzer AWS deployment (Terraform)

Deploys Quizzer to AWS for **$0/month**, by staying entirely inside the
AWS Free Tier (first 12 months of a new account) and deliberately leaving
out every component that isn't free: no Application Load Balancer, no NAT
Gateway, no ECS Fargate, no Secrets Manager.

## What this creates

- One EC2 instance (`t2.micro`, free tier) running the app's two Docker
  containers via `docker-compose`, pulled from ECR.
- One RDS Postgres instance (`db.t3.micro`, free tier) replacing the
  containerized database used in local dev.
- An Elastic IP for a stable public address (free while attached to a
  running instance).
- Two ECR repositories to store the built images.
- Security hardening: IMDSv2 enforced, encryption at rest on both the EC2
  disk and RDS storage, no SSH port open (use SSM Session Manager instead),
  least-privilege IAM role on the instance, and a free CloudTrail
  management-event trail.
- A cost cap: email alerts at 50% forecasted / 100% actual spend, plus an
  automatic action that stops the EC2 instance if actual spend crosses the
  limit (default $1). Billing data isn't real-time, so treat this as a
  tight leash, not an instant hard stop.

## Before you run anything

1. Install Terraform: `winget install HashiCorp.Terraform`
2. Configure your AWS credentials (do this yourself - never paste access
   keys into a chat): `aws configure`
3. Copy the vars file and fill in your own email:
   ```
   cp terraform.tfvars.example terraform.tfvars
   ```

## Usage

```
terraform init      # downloads the AWS provider, no AWS calls yet
terraform validate  # checks syntax, no AWS calls yet
terraform plan       # read-only - shows what would be created
terraform apply      # actually creates the resources - review the plan first
```

After `apply`, build and push the images, then the instance will already
be running and will pick them up on next boot - to deploy without
rebooting, re-run the push and then restart the containers over SSM:

```
..\scripts\deploy-to-ecr.ps1 -BackendRepoUrl <ecr_backend_repo_url output> -FrontendRepoUrl <ecr_frontend_repo_url output>
```

## Known things to double check on first apply

This was written without a live AWS connection to test against, so two
areas are worth confirming with `terraform plan` before `apply`:

- `engine_version = "16"` in `rds.tf` - if AWS requires a more specific
  minor version in your region, `terraform plan` will say so.
- The `aws_budgets_budget_action` block in `budget.tf` - the nested
  `ssm_action_definition` shape has changed across provider versions; if
  `terraform validate` complains, check the current
  `hashicorp/aws` docs for `aws_budgets_budget_action`.

## Free tier expiry

The free tier applies for 12 months from when your AWS account was
created, not from today. After that, this same setup costs roughly
$15-20/month if left running. Either run `terraform destroy` before that
date or decide it's worth paying for at that point.

## Tearing down

```
terraform destroy
```

Note the EC2 instance is designed to run continuously (one instance uses
~730 of the 750 free hours/month), so there's no need to destroy between
sessions purely to save money, unlike the original ECS+ALB design this
replaced.
