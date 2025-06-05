# whisper
A naive chatroom.


# Localstack

```bash
docker run --rm -it -p 4566:4566 -p 4571:4571 localstack/localstack
```


# Terraform

First, change directory to `terraform`.

```bash
cd terraform
```

## For AWS Deployment:

```bash
just tf-aws-init
```

```bash
just tf-aws-apply
```

## Local

```bash
just tf-local-init
```

```bash
just tf-local-apply
```