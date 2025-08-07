![Lifecycle:Retired](https://img.shields.io/badge/Lifecycle-Retired-d45500)

As of Augus 2025 the repository is retired. The scripts that were still in use have been moved to the sso-terraform repo.


## Purpose

This common action covers one of the limitations of Terraform, such that there is no way to control existing resources, and it ensures the target Keycloak instances are provisioned as:

1. `review profile config` execution of the default authentication flow `first broker login` is disabled.
1. `Browser - Conditional OTP` execution of the default authentication flow `Browser` in `Prod` environment is enforced.
