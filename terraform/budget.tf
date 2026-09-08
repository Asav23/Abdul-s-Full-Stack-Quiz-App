# Two layers of protection against an unexpected bill:
# 1. Email alerts at 50% forecasted and 100% actual spend.
# 2. An automatic action that stops the EC2 instance the moment actual
#    spend crosses the limit, without anyone needing to see the email first.
#
# Caveat: AWS billing data updates a few times a day, not in real time, so
# this is a tight leash, not an instant hard stop - spend could tick a few
# cents over the limit before the action fires.

resource "aws_budgets_budget" "cost_cap" {
  name         = "quizzer-cost-cap"
  budget_type  = "COST"
  limit_amount = var.budget_limit_usd
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 50
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.budget_alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.budget_alert_email]
  }
}

resource "aws_iam_role" "budget_action" {
  name = "quizzer-budget-action-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "budgets.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = { Project = "quizzer" }
}

resource "aws_iam_role_policy" "budget_action" {
  name = "quizzer-budget-action-policy"
  role = aws_iam_role.budget_action.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "ec2:StopInstances",
        "ec2:DescribeInstances",
        "ssm:StartAutomationExecution",
        "ssm:GetAutomationExecution"
      ]
      Resource = "*"
    }]
  })
}

resource "aws_budgets_budget_action" "stop_ec2" {
  budget_name        = aws_budgets_budget.cost_cap.name
  action_type        = "RUN_SSM_DOCUMENTS"
  approval_model     = "AUTOMATIC"
  notification_type  = "ACTUAL"
  execution_role_arn = aws_iam_role.budget_action.arn

  action_threshold {
    action_threshold_type  = "PERCENTAGE"
    action_threshold_value = 100
  }

  definition {
    ssm_action_definition {
      action_sub_type = "STOP_EC2_INSTANCES"
      instance_ids    = [aws_instance.app.id]
      region          = var.aws_region
    }
  }

  subscriber {
    subscription_type = "EMAIL"
    address           = var.budget_alert_email
  }
}
