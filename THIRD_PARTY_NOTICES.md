# Third-party notices

This repository orchestrates third-party components without copying their source code into this project.

## New API

- Project: <https://github.com/QuantumNous/new-api>
- Container image: `calciumion/new-api`
- License: GNU Affero General Public License v3.0 (AGPL-3.0)

New API is downloaded as a separate official container image. Review and comply with its license before commercial deployment, especially if you modify New API itself or provide a modified version as a network service.

## PostgreSQL

- Project: <https://www.postgresql.org/>
- Container image: `postgres:15-alpine`
- License: PostgreSQL License

## Redis

- Project: <https://redis.io/>
- Container image: `redis:7.4-alpine`

Redis licensing depends on the selected version. Review the license shipped with the exact image tag used in production. You may replace it with a compatible managed service when required by your organization's licensing policy.

This notice is operational guidance and not legal advice.
