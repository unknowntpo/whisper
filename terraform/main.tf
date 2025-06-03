provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    ec2   = "http://localhost:4566"
    elbv2 = "http://localhost:4566"
    iam   = "http://localhost:4566"
    sts   = "http://localhost:4566"
    s3    = "http://localhost:4566"
    # add more as needed
  }
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web"
  description = "Allow web traffic"
  vpc_id      = aws_vpc.main.id

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

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  count                       = 3
  ami                         = "ami-0c02fb55956c7d316" # Amazon Linux 2, update as needed
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.main.id
  vpc_security_group_ids      = [aws_security_group.allow_web.id]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker git
              service docker start
              usermod -a -G docker ec2-user
              cd /home/ec2-user
              git clone https://github.com/your/repo.git app
              cd app
              docker-compose up -d
              EOF

  tags = {
    Name = "app-instance"
  }
}

# resource "aws_lb" "app_lb" {
#   name               = "app-lb"
#   internal           = false
#   load_balancer_type = "application"
#   subnets            = [aws_subnet.main.id]
#   security_groups    = [aws_security_group.allow_web.id]
# }

# resource "aws_lb_target_group" "app_tg" {
#   name     = "app-tg"
#   port     = 8000
#   protocol = "HTTP"
#   vpc_id   = aws_vpc.main.id
#   health_check {
#     path                = "/"
#     protocol            = "HTTP"
#     matcher             = "200-399"
#     interval            = 30
#     timeout             = 5
#     healthy_threshold   = 2
#     unhealthy_threshold = 2
#   }
# }

# resource "aws_lb_listener" "app_listener" {
#   load_balancer_arn = aws_lb.app_lb.arn
#   port              = "80"
#   protocol          = "HTTP"

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app_tg.arn
#   }
# }

# resource "aws_lb_target_group_attachment" "app_attachment" {
#   count            = 3
#   target_group_arn = aws_lb_target_group.app_tg.arn
#   target_id        = aws_instance.app[count.index].id
#   port             = 8000
# }

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
