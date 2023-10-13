# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

<a name="unreleased"></a>
## [Unreleased]



<a name="v0.62.0"></a>
## [v0.62.0] - 2023-10-13
FEATURES:
- Add sign saml assertions ([#64](https://github.com/bcgov/sso-requests-actions/issues/64))


<a name="v0.61.0"></a>
## [v0.61.0] - 2023-09-22



<a name="v0.60.0"></a>
## [v0.60.0] - 2023-06-08
FEATURES:
- Just use cache key
- Running debug commands
- Added working directory for cache step
- Added shell property to custom step
- Removed unnecessary spaces
- Caching the terraform modules to reduce init times


<a name="v0.59.0"></a>
## [v0.59.0] - 2023-05-16

- Do not generate duplicate tf file for oidc


<a name="v0.58.0"></a>
## [v0.58.0] - 2023-04-21



<a name="list"></a>
## [list] - 2023-04-21

- Custom function for generating client id
- Generate saml tf module name with id and project name


<a name="v0.57.0"></a>
## [v0.57.0] - 2023-03-21

- Add saml logout service post binding url


<a name="v0.56.0"></a>
## [v0.56.0] - 2023-01-20

- Trim additional role attribute
- Added a validation to block overwriting preserved claims


<a name="v0.55.0"></a>
## [v0.55.0] - 2022-12-06

- Remove unnecessary characters in html


<a name="v0.54.0"></a>
## [v0.54.0] - 2022-12-05

- Fix minor impl
- Refactored code
- Refactored validations
- Add redirect uri for browser logins
- Created separate file to build pr body
- Added additional fields to PR


<a name="v0.53.0"></a>
## [v0.53.0] - 2022-12-02

- Pass login theme that hides title in the header
- Add missing license
- Resolve repo-mountie issues


<a name="v0.52.0"></a>
## [v0.52.0] - 2022-10-18
FEATURES:
- Add wellknown action


<a name="v0.51.0"></a>
## [v0.51.0] - 2022-10-14
FEATURES:
- Add an action to create master viewer role


<a name="v0.50.0"></a>
## [v0.50.0] - 2022-10-11

- Rename kc version arg


<a name="v0.49.0"></a>
## [v0.49.0] - 2022-10-11

- Update kc-version description
- Pass kc version into the tf action


<a name="v0.48.0"></a>
## [v0.48.0] - 2022-09-23
FEATURES:
- Add dynamo table in terraform action


<a name="v0.47.0"></a>
## [v0.47.0] - 2022-09-23
FEATURES:
- Support additional role attribute to deliver roles


<a name="v0.46.0"></a>
## [v0.46.0] - 2022-09-08

- Fix typos


<a name="v0.45.0"></a>
## [v0.45.0] - 2022-09-08

- Separate github oauth client credentials


<a name="v0.44.0"></a>
## [v0.44.0] - 2022-09-07
FEATURES:
- Add github oauth credentials in envs


<a name="v0.43.0"></a>
## [v0.43.0] - 2022-09-02

- Add a task to remove unused client scopes


<a name="v0.42.0"></a>
## [v0.42.0] - 2022-08-25

- Add web origins for service accounts
- Add web origins for service accounts


<a name="v0.41.0"></a>
## [v0.41.0] - 2022-08-16

- Remove notused lines


<a name="v0.40.0"></a>
## [v0.40.0] - 2022-08-16
FEATURES:
- Add saml client workflow


<a name="v0.39.0"></a>
## [v0.39.0] - 2022-08-05

- Ensure not to create client files when archiving


<a name="v0.38.0"></a>
## [v0.38.0] - 2022-07-20

- Fix a typo


<a name="v0.37.0"></a>
## [v0.37.0] - 2022-07-20

- Fix a bug passing tf module ref


<a name="v0.36.0"></a>
## [v0.36.0] - 2022-07-20

- Increase the allowed file changes


<a name="v0.35.0"></a>
## [v0.35.0] - 2022-07-08

- Udpate changelog
- Set valid redirect uris iff standard flow enabled


<a name="v0.34.0"></a>
## [v0.34.0] - 2022-07-07
FEATURES:
- Support service accounts


<a name="v0.33.0"></a>
## [v0.33.0] - 2022-05-30
FEATURES:
- Support team service account


<a name="v0.32.0"></a>
## [v0.32.0] - 2022-05-25
FEATURES:
- Store terraform state in s3 bucket


<a name="v0.31.0"></a>
## [v0.31.0] - 2022-05-19
FEATURES:
- Pass azure idir integration details


<a name="v0.30.0"></a>
## [v0.30.0] - 2022-05-18
FEATURES:
- Support login page titles


<a name="v0.29.0"></a>
## [v0.29.0] - 2022-05-10
FEATURES:
- Enforce otp in prod environment


<a name="v0.28.0"></a>
## [v0.28.0] - 2022-05-02

- Add missing action parameters


<a name="v0.27.0"></a>
## [v0.27.0] - 2022-05-02
FEATURES:
- Add common github actions


<a name="v0.26.0"></a>
## [v0.26.0] - 2022-04-12

- Add missing suffix in auth url


<a name="v0.25.0"></a>
## [v0.25.0] - 2022-04-12
FEATURES:
- Add github action module to update keycloak instances


<a name="v0.24.0"></a>
## [v0.24.0] - 2022-04-12

- Update gold integration generation script


<a name="v0.23.0"></a>
## [v0.23.0] - 2022-04-11

- Remove unused variables


<a name="v0.22.0"></a>
## [v0.22.0] - 2022-04-11
FEATURES:
- Add token fields


<a name="v0.21.0"></a>
## [v0.21.0] - 2022-04-07

- Provision roles via terraform client files


<a name="v0.20.0"></a>
## [v0.20.0] - 2022-03-30

- Fix redirect uri


<a name="v0.19.0"></a>
## [v0.19.0] - 2022-03-25

- Add standard realm id from vars


<a name="v0.18.0"></a>
## [v0.18.0] - 2022-03-25
FEATURES:
- Support gold


<a name="v0.17.0"></a>
## [v0.17.0] - 2022-03-09
FEATURES:
- Update request action to support batch system


<a name="v0.16.0"></a>
## [v0.16.0] - 2022-03-01

- Update changelog
- Set bigger default values for allowed file add/del


<a name="v0.15.0"></a>
## [v0.15.0] - 2022-03-01
FEATURES:
- Check pr file change numbers instead of tf changes


<a name="v0.14.0"></a>
## [v0.14.0] - 2022-02-18
FEATURES:
- Close empty pr gracefully


<a name="v0.13.0"></a>
## [v0.13.0] - 2022-01-25

- Pr to add + in addition to redirect uris


<a name="v0.12.0"></a>
## [v0.12.0] - 2022-01-07

- Origins


<a name="v0.11.0"></a>
## [v0.11.0] - 2021-12-01
BUG FIXES:
- Null string
- Null string
- Null string


<a name="v0.10.0"></a>
## [v0.10.0] - 2021-11-30

- Support browser flow override


<a name="v0.9.0"></a>
## [v0.9.0] - 2021-11-26

- Add browser override option


<a name="v0.8.0"></a>
## [v0.8.0] - 2021-11-22

- Only allow web origins for public clients


<a name="v0.7.0"></a>
## [v0.7.0] - 2021-11-19

- Add + for confidential clients


<a name="v0.6.0"></a>
## [v0.6.0] - 2021-10-19

- Changelog
- Description


<a name="v0.5.0"></a>
## [v0.5.0] - 2021-08-24

- Use terraform source from modulized repo
- Delete all open issues before creating another one


<a name="v0.4.0"></a>
## [v0.4.0] - 2021-08-20
BUG FIXES:
- Cleanup
- Label length


<a name="v0.3.0"></a>
## [v0.3.0] - 2021-08-13

- Fix typo


<a name="v0.2.0"></a>
## [v0.2.0] - 2021-08-13
FEATURES:
- Add action for terraform plan


<a name="v0.1.0"></a>
## v0.1.0 - 2021-08-12
FEATURES:
- Add action for request workflow


[Unreleased]: https://github.com/bcgov/sso-requests-actions/compare/v0.62.0...HEAD
[v0.62.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.61.0...v0.62.0
[v0.61.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.60.0...v0.61.0
[v0.60.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.59.0...v0.60.0
[v0.59.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.58.0...v0.59.0
[v0.58.0]: https://github.com/bcgov/sso-requests-actions/compare/list...v0.58.0
[list]: https://github.com/bcgov/sso-requests-actions/compare/v0.57.0...list
[v0.57.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.56.0...v0.57.0
[v0.56.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.55.0...v0.56.0
[v0.55.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.54.0...v0.55.0
[v0.54.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.53.0...v0.54.0
[v0.53.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.52.0...v0.53.0
[v0.52.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.51.0...v0.52.0
[v0.51.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.50.0...v0.51.0
[v0.50.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.49.0...v0.50.0
[v0.49.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.48.0...v0.49.0
[v0.48.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.47.0...v0.48.0
[v0.47.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.46.0...v0.47.0
[v0.46.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.45.0...v0.46.0
[v0.45.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.44.0...v0.45.0
[v0.44.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.43.0...v0.44.0
[v0.43.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.42.0...v0.43.0
[v0.42.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.41.0...v0.42.0
[v0.41.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.40.0...v0.41.0
[v0.40.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.39.0...v0.40.0
[v0.39.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.38.0...v0.39.0
[v0.38.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.37.0...v0.38.0
[v0.37.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.36.0...v0.37.0
[v0.36.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.35.0...v0.36.0
[v0.35.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.34.0...v0.35.0
[v0.34.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.33.0...v0.34.0
[v0.33.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.32.0...v0.33.0
[v0.32.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.31.0...v0.32.0
[v0.31.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.30.0...v0.31.0
[v0.30.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.29.0...v0.30.0
[v0.29.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.28.0...v0.29.0
[v0.28.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.27.0...v0.28.0
[v0.27.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.26.0...v0.27.0
[v0.26.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.25.0...v0.26.0
[v0.25.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.24.0...v0.25.0
[v0.24.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.23.0...v0.24.0
[v0.23.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.22.0...v0.23.0
[v0.22.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.21.0...v0.22.0
[v0.21.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.20.0...v0.21.0
[v0.20.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.19.0...v0.20.0
[v0.19.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.18.0...v0.19.0
[v0.18.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.17.0...v0.18.0
[v0.17.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.16.0...v0.17.0
[v0.16.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.15.0...v0.16.0
[v0.15.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.14.0...v0.15.0
[v0.14.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.13.0...v0.14.0
[v0.13.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.12.0...v0.13.0
[v0.12.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.11.0...v0.12.0
[v0.11.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.10.0...v0.11.0
[v0.10.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.9.0...v0.10.0
[v0.9.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.8.0...v0.9.0
[v0.8.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.7.0...v0.8.0
[v0.7.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.6.0...v0.7.0
[v0.6.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.5.0...v0.6.0
[v0.5.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.4.0...v0.5.0
[v0.4.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/bcgov/sso-requests-actions/compare/v0.1.0...v0.2.0
