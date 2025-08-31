# Grain — Project Overview

Grain is a Spring Boot 3 application that lets users upload CSV-based datasets and receive daily email snippets from those datasets. It persists user data in PostgreSQL and uses JPA/Hibernate for ORM. DTO mapping is handled by MapStruct with Lombok to reduce boilerplate.

## Architecture

- REST API (Spring Web)
  - UserController: create user, fetch user by id.
  - CSV upload endpoint (controller not shown here) to create datasets.
- Service Layer
  - UserService: user creation and lookup.
  - UserDataSetService: CSV parsing → UserDataSet + UserDataSetItems + UserProgress.
  - UserEmailService: sends daily emails and advances per-dataset progress.
- Persistence (Spring Data JPA)
  - UserRepository: user queries and relation loading via EntityGraph or JPQL.
  - UserDataSetRepository, UserProgressRepository: dataset/progress persistence.
- Email (Spring Mail)
  - SMTP via Gmail with STARTTLS (App Password required).

## Domain Model

- User
  - userId, name, email
  - userDataSets: List<UserDataSet>
- UserDataSet
  - userDataSetId, topic, useAi
  - user: User (ManyToOne)
  - userProgress: UserProgress (OneToOne)
  - items: List<UserDataSetItem> (OneToMany)
- UserDataSetItem
  - userDataSetItemId, rowNumber, rowData
  - userDataSet: UserDataSet
- UserProgress
  - userProgressId, lastSentItem (0-based next index), status ("Active"/"InActive")
  - userDataSet: UserDataSet

Notes:
- Items are LAZY with FetchMode.SUBSELECT to avoid MultipleBagFetchException.
- EntityGraph prefetches userDataSets and userProgress where needed.

## Data Flow

1) User creation
- POST /users/create → UserService → save → return UserResponseDto.

2) CSV upload
- Parse header + rows.
- Build UserDataSet, initialize UserProgress(lastSentItem=0, status=Active).
- Build UserDataSetItem per row, set ownership with helper methods.
- Save dataset; CascadeType.ALL persists progress and items.

3) Daily email
- Query users with Active progress (distinct).
- For each dataset:
  - idx = lastSentItem (next item to send).
  - If idx < items.size: send items[idx], then lastSentItem = idx + 1.
  - If reached end: set status = InActive.

## Persistence Strategy

- Use @EntityGraph(attributePaths = { "userDataSets", "userDataSets.userProgress" }) where mapping accesses those relations.
- Avoid join-fetching multiple List collections simultaneously (causes MultipleBagFetchException).
- For item counts, prefer projections or load items lazily with SUBSELECT.

## Mapping

- MapStruct generates DTO mappers.
- Lombok + MapStruct binding enabled via annotationProcessorPaths in Maven.
- Common mappings:
  - User → UserResponseDto (maps userDataSets).
  - UserDataSet → UserDataSetDTO (maps progress + itemCount).
  - UserProgress → UserProgressDTO.

## Configuration

- application.properties uses environment variables:
  - DB_PASSWORD, MAIL_USERNAME, MAIL_PASSWORD.
- Mail:
  - smtp.gmail.com:587, STARTTLS required.
  - Use Gmail App Passwords (2FA).

## Build & Run (Windows)

- Build: mvnw.cmd -q clean package
- Run: mvnw.cmd spring-boot:run
- Tests: mvnw.cmd -q test
- Default port: 8838

## API Snapshot

- POST /users/create → 201 Created (UserResponseDto)
- GET /users/{id} → 200 OK (UserResponseDto)
- POST /readCsv?userId={id}&useAi={bool} (multipart file “file”) → 200 OK (UserDataSetDTO)
- GET /users/testMail → triggers test email or daily send

## Error Handling & Validation

- Controller uses @Valid for request DTOs (ensure DTO fields have Jakarta validation annotations).
- Service guards:
  - Duplicate email checks.
  - EntityNotFound for missing users/datasets.
  - Bounds checks on lastSentItem vs items size.

## Performance Tips

- Use EntityGraph selectively; don’t overfetch items unless needed.
- Consider paging for “users by progress status” endpoints.
- Batch inserts via cascade; set allocationSize on sequences for fewer roundtrips.

## Known Constraints

- Gmail requires App Passwords; normal passwords are rejected.
- Multiple List join-fetch is disallowed by Hibernate; use SUBSELECT or Set collections.

## Repository Hygiene

- .gitignore excludes IDE/build/data artifacts and secrets.
- .gitattributes enforces line endings and text normalization.

<img width="625" height="582" alt="Screenshot 2025-08-31 040852" src="https://github.com/user-attachments/assets/d4a4476d-635d-4ea2-b1e2-d49001855f7d" />



