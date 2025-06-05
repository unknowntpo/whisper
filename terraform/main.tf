variable "aws_profile" {
  description = "AWS profile"
  type        = string
}

variable "deploy_with_lb" {
  description = "Whether to deploy with Load Balancer (ALB)"
  type        = bool
  default     = false
}

provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = var.aws_profile
  region                   = "us-east-1"
  # Uncomment below for LocalStack
  # skip_credentials_validation = true
  # skip_metadata_api_check     = true
  # endpoints {
  #   ec2   = "http://localhost:4566"
  #   elbv2 = "http://localhost:4566"
  #   iam   = "http://localhost:4566"
  #   sts   = "http://localhost:4566"
  #   s3    = "http://localhost:4566"
  # }
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web"
  description = "Allow web traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                         = "ami-0b0dcb5067f052a63" # Amazon Linux 2023 AMI
  instance_type               = "t2.micro"
  subnet_id                   = tolist(data.aws_subnets.default.ids)[0]
  vpc_security_group_ids      = [aws_security_group.allow_web.id]
  associate_public_ip_address = true
  key_name                    = "MyKeyPair"

  user_data = <<-EOF
            #!/bin/bash
			yum update -y
			yum install -y git
			amazon-linux-extras install docker
			service docker start
			usermod -a -G docker ec2-user
			chkconfig docker on
            # Clone and start the application
			sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
			sudo chmod +x /usr/local/bin/docker-compose
			docker-compose version
			sudo yum install -y docker-compose-plugin
            cd /home/ec2-user
            git clone https://github.com/unknowntpo/whisper.git app
            cd app
            docker-compose up -d
            EOF

  tags = {
    Name = "app-instance"
  }
}

resource "aws_lb" "app_lb" {
  count              = var.deploy_with_lb ? 1 : 0
  name               = "app-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.default.ids
  security_groups    = [aws_security_group.allow_web.id]
}

resource "aws_lb_target_group" "app_tg" {
  count    = var.deploy_with_lb ? 1 : 0
  name     = "app-tg"
  port     = 5173
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "app_listener" {
  count             = var.deploy_with_lb ? 1 : 0
  load_balancer_arn = aws_lb.app_lb[0].arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg[0].arn
  }
}

resource "aws_lb_target_group_attachment" "app_attachment" {
  count            = var.deploy_with_lb ? 1 : 0
  target_group_arn = aws_lb_target_group.app_tg[0].arn
  target_id        = aws_instance.app.id
  port             = 5173
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket" "test_bucket" {
  bucket = "my-test-bucket-${random_string.suffix.result}"
}

resource "aws_s3_bucket_public_access_block" "test_bucket" {
  bucket = aws_s3_bucket.test_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

output "ec2_public_ip" {
  description = "The public IP address of the EC2 instance running the app."
  value       = aws_instance.app.public_ip
}

output "ec2_public_dns" {
  description = "The public DNS address of the EC2 instance running the app."
  value       = aws_instance.app.public_dns
}
