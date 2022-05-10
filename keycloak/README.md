## Purpose

This common action covers the one of the limitations of Terraform, such that there is no way to control of existing resources, and ensures the target Keycloak instances to be provisioned as:

1. Disable `review profile config` execution of the default authentication flow `first broker login`.
1. Enforce `Browser - Conditional OTP` exection of the default authentication flow `Browser` in `Prod` environment.
