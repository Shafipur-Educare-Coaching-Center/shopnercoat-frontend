# Backend API Specification: Student Profile & Account Modification Engine

This document outlines the complete REST API contract, JSON schema definitions, entity models, and NestJS controller/service reference code for the **My Profile & Account Settings** (`/dashboard/student/profile`) portal.

---

## 📌 Executive Summary of Endpoints

| Endpoint | Method | Role | Description |
|---|---|---|---|
| **`/v1/students/me`** | `GET` | `STUDENT` | Fetches the complete profile and user account details of the authenticated candidate. |
| **`/v1/students/me`** | `PATCH` | `STUDENT` | Updates editable profile fields (Name, Photo, College, Guardian Contact, Addresses, etc.). |
| **`/v1/auth/change-password`** | `POST` | `STUDENT`/`ADMIN` | Securely updates candidate account password. |
| **`/v1/auth/update-account`** | `PATCH` | `STUDENT` | Updates account contact information (Email, Mobile). |

---

## 1. 📋 Student Profile Endpoints

### A. `GET /v1/students/me`
#### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Candidate profile retrieved successfully",
  "data": {
    "id": "376a8850-fef7-404c-80e0-5af31fab4515",
    "userId": "usr-8891-std",
    "fullName": "Tahmid Hasan",
    "dateOfBirth": "2006-05-14T00:00:00.000Z",
    "fatherName": "Md. Rafiqul Islam",
    "motherName": "Hosne Ara Begum",
    "parentMobileNumber": "01711223344",
    "guardianMobileNumber": "01811223344",
    "presentAddress": "Shafipur, Gazipur, Dhaka",
    "permanentAddress": "Shafipur, Gazipur, Dhaka",
    "photoUrl": "https://api.shopnercoat.xyz/uploads/avatars/std-001.jpg",
    "signatureUrl": "https://api.shopnercoat.xyz/uploads/signatures/std-001.png",
    "rollNumber": 9242808,
    "registrationNumber": 20259242808,
    "collegeName": "Notre Dame College",
    "registrationStatus": "COMPLETED",
    "createdAt": "2026-08-01T10:00:00.000Z",
    "updatedAt": "2026-09-01T12:00:00.000Z",
    "user": {
      "id": "usr-8891-std",
      "mobileNumber": "01712345678",
      "email": "tahmid.hasan@example.com",
      "role": "STUDENT",
      "status": "ACTIVE"
    }
  }
}
```

---

### B. `PATCH /v1/students/me`
#### 📥 Request Body
```json
{
  "fullName": "Tahmid Hasan",
  "collegeName": "Notre Dame College",
  "photoUrl": "https://api.shopnercoat.xyz/uploads/avatars/std-001.jpg",
  "dateOfBirth": "2006-05-14T00:00:00.000Z",
  "fatherName": "Md. Rafiqul Islam",
  "motherName": "Hosne Ara Begum",
  "parentMobileNumber": "01711223344",
  "guardianMobileNumber": "01811223344",
  "presentAddress": "Shafipur, Gazipur, Dhaka",
  "permanentAddress": "Shafipur, Gazipur, Dhaka"
}
```

#### 📤 Response Payload (`200 OK`)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Candidate profile updated successfully",
  "data": { ... }
}
```

---

## 2. 🔒 Security & Account Modification Endpoints

### A. `POST /v1/auth/change-password`
#### 📥 Request Body
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@2026",
  "confirmPassword": "NewPassword@2026"
}
```

---

## 3. 💾 NestJS Controller & Service Implementation Reference

```typescript
// students.controller.ts
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('me')
  @Roles('STUDENT')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const profile = await this.studentsService.getStudentByUserId(req.user.id);
    return {
      statusCode: 200,
      success: true,
      data: profile,
    };
  }

  @Patch('me')
  @Roles('STUDENT')
  async updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    const updated = await this.studentsService.updateStudentByUserId(req.user.id, dto);
    return {
      statusCode: 200,
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    };
  }
}
```
