# Onboarding API Reference

This document lists onboarding-related APIs and their request/response bodies.

---

## Student Onboarding

- **POST /api/students/onboarding/education**
  - Request JSON:
    ```json
    {
      "collegeName": "Example University",
      "degree": "B.Sc Computer Science",
      "graduationYear": 2024
    }
    ```
  - Success (200):
    ```json
    {
      "message": "Student education saved successfully",
      "nextStep": "STUDENT_SKILLS"
    }
    ```

- **POST /api/students/onboarding/skills**
  - Request JSON:
    ```json
    {
      "skills": ["javascript", "react", "sql"]
    }
    ```
  - Success (200):
    ```json
    {
      "message": "Student skills saved successfully",
      "nextStep": "STUDENT_LOCATION"
    }
    ```

- **POST /api/students/onboarding/location**
  - Request JSON:
    ```json
    {
      "city": "Bengaluru",
      "state": "Karnataka"
    }
    ```
  - Success (200):
    ```json
    {
      "message": "Student onboarding completed successfully",
      "nextStep": "COMPLETED"
    }
    ```

Common error responses (validation/auth):
```json
{ "error": true, "message": "..." }
```

---

## Recruiter Onboarding

- **POST /api/recruiters/onboarding/professional**
  - Request JSON:
    ```json
    { "professionalTitle": "HR Manager" }
    ```
  - Success (201):
    ```json
    { "message": "Recruiter professional details saved successfully" }
    ```

- **POST /api/recruiters/onboarding/company**
  - Request JSON:
    ```json
    {
      "companyName": "Acme Corp",
      "city": "Mumbai",
      "state": "Maharashtra"
    }
    ```
  - Success (201):
    ```json
    { "message": "Recruiter company details saved successfully" }
    ```

- **POST /api/recruiters/onboarding/description**
  - Request JSON:
    ```json
    {
      "companyDescription": "We build great products...",
      "companyWebsite": "https://acme.example.com"
    }
    ```
  - Success (200):
    ```json
    { "message": "Recruiter onboarding completed successfully" }
    ```

Common error responses (validation/auth):
```json
{ "error": true, "message": "..." }
```

---

## Role Selection (onboarding step)

- **POST /api/auth/select-role**
  - Request JSON:
    ```json
    { "role": "STUDENT" }
    ```
  - Success (200):
    ```json
    { "message": "Role selected successfully" }
    ```
  - Errors:
    - 400 Invalid role: `{ "message": "Invalid role" }`
    - 403 Already onboarded: `{ "message": "Onboarding already completed" }`

---

### Notes
- All onboarding endpoints are protected and expect authenticated requests (cookies with `accessToken`) and appropriate role/verified user as configured in middleware.
- Validation errors return HTTP 400 with the error message; operational errors are handled by the global error handler returning `{ "error": true, "message": "..." }`.
