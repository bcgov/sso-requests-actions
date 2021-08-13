# sso-requests-actions

GitHub Actions to support sso-requests development process

## Related repositories

- https://github.com/bcgov/sso-requests
- https://github.com/bcgov/sso-terraform-dev
- https://github.com/bcgov/sso-terraform

## Action - Request

GitHub Action to trigger SSO Keycloak client request workflow in dev and prod environments.

## Action - Plan

GitHub Action to parse the planned Terraform changes and update the status of the client request in the backend database.

## Technical Details

- This repository adds `node_modules` directory intentionally to include any package dependencies required to run the actions.
- see https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github
