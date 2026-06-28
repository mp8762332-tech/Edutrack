# EduTrack Testing Guide - School Trial Deployment

## Test Scope

This document outlines comprehensive testing for EduTrack school management system before trial deployment to schools.

## 1. Authentication Testing

### Test Case 1.1: Author Login
- [ ] Navigate to login page
- [ ] Select "Author" role
- [ ] Enter valid credentials
- [ ] Verify Author dashboard loads
- [ ] Verify access to school registration
- [ ] Verify access to registration codes
- [ ] Verify access to analytics

### Test Case 1.2: School Admin Login
- [ ] Navigate to login page
- [ ] Select "School Admin" role
- [ ] Enter valid credentials
- [ ] Verify Admin dashboard loads
- [ ] Verify access to students, teachers, marks
- [ ] Verify cannot access other schools' data

### Test Case 1.3: Teacher Login
- [ ] Navigate to login page
- [ ] Select "Teacher" role
- [ ] Enter valid credentials
- [ ] Verify Teacher dashboard loads
- [ ] Verify access to marks entry
- [ ] Verify access to attendance
- [ ] Verify cannot access admin functions

### Test Case 1.4: Student Login
- [ ] Navigate to login page
- [ ] Select "Student" role
- [ ] Enter valid credentials
- [ ] Verify Student dashboard loads
- [ ] Verify access to report cards
- [ ] Verify access to results
- [ ] Verify cannot modify data

### Test Case 1.5: Logout
- [ ] Login as any user
- [ ] Click logout
- [ ] Verify redirected to login page
- [ ] Verify session cleared
- [ ] Verify cannot access dashboard without login

## 2. School Registration Testing

### Test Case 2.1: Generate Registration Code
- [ ] Login as Author
- [ ] Navigate to "Registration Codes"
- [ ] Click "Generate Code"
- [ ] Verify 6-digit code generated
- [ ] Verify code format is alphanumeric
- [ ] Verify expiration date is 30 days
- [ ] Verify status is "active"

### Test Case 2.2: Copy Registration Code
- [ ] Generate registration code
- [ ] Click "Copy" button
- [ ] Verify code copied to clipboard
- [ ] Verify toast notification shows "Code copied"

### Test Case 2.3: Send Code via Email
- [ ] Generate registration code
- [ ] Click "Send Email" button
- [ ] Verify email client opens
- [ ] Verify code is in email body
- [ ] Verify subject line is correct

### Test Case 2.4: Register School
- [ ] Login as Author
- [ ] Click "Register School"
- [ ] Fill in school name, email, phone
- [ ] Click "Register"
- [ ] Verify school appears in list
- [ ] Verify status is "pending"
- [ ] Verify school code is assigned

## 3. Student Management Testing

### Test Case 3.1: Add Student
- [ ] Login as School Admin
- [ ] Navigate to "Students"
- [ ] Click "Add Student"
- [ ] Fill in name, admission number, class
- [ ] Click "Save"
- [ ] Verify student appears in list
- [ ] Verify student can login

### Test Case 3.2: Bulk Import Students
- [ ] Login as School Admin
- [ ] Navigate to "Students"
- [ ] Click "Import CSV"
- [ ] Upload CSV with 100 students
- [ ] Verify import progress shows
- [ ] Verify all students imported
- [ ] Verify no duplicates

### Test Case 3.3: Edit Student
- [ ] Login as School Admin
- [ ] Select student from list
- [ ] Click "Edit"
- [ ] Modify student details
- [ ] Click "Save"
- [ ] Verify changes saved

### Test Case 3.4: Search Student
- [ ] Login as School Admin
- [ ] Use search box
- [ ] Search by name, admission number
- [ ] Verify results appear
- [ ] Verify search is case-insensitive

## 4. Marks Entry Testing

### Test Case 4.1: Enter Mid-Term Marks
- [ ] Login as Teacher
- [ ] Navigate to "Marks"
- [ ] Select class and subject
- [ ] Enter Paper 1 and Paper 2 marks
- [ ] Verify average calculated: (P1 + P2) / 2
- [ ] Verify grade assigned correctly:
  - [ ] 80-100 = A
  - [ ] 60-79 = B
  - [ ] 49-59 = C
  - [ ] 20-39 = D
  - [ ] 0-19 = E
- [ ] Click "Save"
- [ ] Verify marks saved

### Test Case 4.2: Bulk Mark Entry
- [ ] Login as Teacher
- [ ] Select class and subject
- [ ] Enter marks for 50 students
- [ ] Click "Save All"
- [ ] Verify all marks saved
- [ ] Verify no data loss

### Test Case 4.3: Mark Validation
- [ ] Try to enter mark > 100
- [ ] Verify error message
- [ ] Try to enter negative mark
- [ ] Verify error message
- [ ] Try to enter non-numeric value
- [ ] Verify error message

### Test Case 4.4: Automatic Grading
- [ ] Enter marks for multiple students
- [ ] Verify grades auto-calculated
- [ ] Verify remarks assigned correctly
- [ ] Verify position calculated

## 5. Report Card Testing

### Test Case 5.1: Generate Report Card
- [ ] Login as School Admin
- [ ] Navigate to "Report Cards"
- [ ] Select student and term
- [ ] Click "Generate"
- [ ] Verify report card displays
- [ ] Verify all marks shown
- [ ] Verify average score correct
- [ ] Verify position correct

### Test Case 5.2: Print Report Card
- [ ] Generate report card
- [ ] Click "Print"
- [ ] Verify print preview opens
- [ ] Verify A4 format
- [ ] Verify all content visible
- [ ] Verify no page breaks in middle of content
- [ ] Print to PDF
- [ ] Verify PDF quality

### Test Case 5.3: Download Report Card
- [ ] Generate report card
- [ ] Click "Download"
- [ ] Verify file downloads
- [ ] Verify filename format: StudentName_ReportCard_T1_2026.pdf
- [ ] Verify PDF opens correctly

### Test Case 5.4: Share via WhatsApp
- [ ] Generate report card
- [ ] Click "Share WhatsApp"
- [ ] Verify WhatsApp opens
- [ ] Verify message has student name and scores
- [ ] Verify can send message

### Test Case 5.5: Bulk Generate Report Cards
- [ ] Login as School Admin
- [ ] Select class and term
- [ ] Click "Generate All"
- [ ] Verify progress bar shows
- [ ] Verify all report cards generated
- [ ] Verify can download as ZIP

## 6. Attendance Testing

### Test Case 6.1: Record Attendance
- [ ] Login as Teacher
- [ ] Navigate to "Attendance"
- [ ] Select class and date
- [ ] Mark students present/absent
- [ ] Click "Save"
- [ ] Verify attendance saved

### Test Case 6.2: Attendance Validation
- [ ] Try to record attendance for future date
- [ ] Verify error message
- [ ] Try to record attendance twice for same date
- [ ] Verify warning message

### Test Case 6.3: Attendance Report
- [ ] Login as School Admin
- [ ] Navigate to "Attendance Reports"
- [ ] Select class and date range
- [ ] Verify report shows
- [ ] Verify attendance percentage calculated
- [ ] Verify can export to CSV

## 7. Timetable Testing

### Test Case 7.1: Create Academic Timetable
- [ ] Login as School Admin
- [ ] Navigate to "Timetables"
- [ ] Select "Academic"
- [ ] Add class schedule
- [ ] Verify no conflicts
- [ ] Click "Save"
- [ ] Verify timetable saved

### Test Case 7.2: Create Exam Timetable
- [ ] Login as School Admin
- [ ] Navigate to "Timetables"
- [ ] Select "Mid-Term Exam"
- [ ] Add exam schedule
- [ ] Verify can override academic schedule
- [ ] Click "Save"
- [ ] Verify exam timetable saved

### Test Case 7.3: View Timetable
- [ ] Login as Teacher
- [ ] Navigate to "Timetable"
- [ ] Select class
- [ ] Verify correct schedule displays
- [ ] Verify can switch between Academic/Exam

### Test Case 7.4: Timetable Conflict Detection
- [ ] Create timetable with overlapping times
- [ ] Verify conflict warning appears
- [ ] Verify cannot save conflicting schedule

## 8. Performance Testing

### Test Case 8.1: Page Load Time
- [ ] Measure homepage load time
- [ ] Target: < 2 seconds
- [ ] Measure dashboard load time
- [ ] Target: < 3 seconds
- [ ] Measure report card generation
- [ ] Target: < 5 seconds for 50 students

### Test Case 8.2: Mobile Performance
- [ ] Test on mobile device (iPhone, Android)
- [ ] Verify responsive layout
- [ ] Verify touch interactions work
- [ ] Measure page size: < 100MB
- [ ] Verify offline functionality works

### Test Case 8.3: Database Performance
- [ ] Load test with 10,000 students
- [ ] Verify query time < 1 second
- [ ] Verify no timeouts
- [ ] Check database indexes working

### Test Case 8.4: Concurrent Users
- [ ] Simulate 100 concurrent users
- [ ] Verify no errors
- [ ] Verify response time < 5 seconds
- [ ] Check server CPU/memory usage

## 9. Data Integrity Testing

### Test Case 9.1: Data Consistency
- [ ] Create student
- [ ] Verify data in database matches UI
- [ ] Modify student
- [ ] Verify changes reflected everywhere
- [ ] Delete student
- [ ] Verify data cleaned up

### Test Case 9.2: Backup & Restore
- [ ] Create test data
- [ ] Trigger backup
- [ ] Delete test data
- [ ] Restore from backup
- [ ] Verify all data restored

### Test Case 9.3: Data Export
- [ ] Export students to CSV
- [ ] Verify all columns present
- [ ] Verify data format correct
- [ ] Verify can re-import CSV

## 10. Security Testing

### Test Case 10.1: Authentication
- [ ] Try to access dashboard without login
- [ ] Verify redirected to login
- [ ] Try to use expired session
- [ ] Verify redirected to login
- [ ] Verify HTTPS enforced

### Test Case 10.2: Authorization
- [ ] Login as Teacher
- [ ] Try to access Admin functions
- [ ] Verify access denied
- [ ] Login as Student
- [ ] Try to modify marks
- [ ] Verify access denied

### Test Case 10.3: SQL Injection
- [ ] Try SQL injection in search
- [ ] Verify no errors
- [ ] Verify data not exposed
- [ ] Try XSS in text fields
- [ ] Verify scripts not executed

### Test Case 10.4: CSRF Protection
- [ ] Verify CSRF tokens present
- [ ] Try to submit form without token
- [ ] Verify request rejected

## 11. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 12. Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Form labels present
- [ ] Error messages clear

## Test Execution

### Pre-Test Setup

```bash
# 1. Deploy to staging environment
vercel --scope=school-management deploy

# 2. Create test data
pnpm run seed:test

# 3. Clear browser cache
# Clear cookies and local storage

# 4. Prepare test devices
# Mobile device, tablet, desktop
```

### Test Execution

```bash
# Run automated tests
pnpm run test

# Run E2E tests
pnpm run test:e2e

# Run performance tests
pnpm run test:performance

# Manual testing checklist
# See test cases above
```

### Test Reporting

Document:
- [ ] Test case ID
- [ ] Status: Pass/Fail/Blocked
- [ ] Notes/Evidence
- [ ] Screenshots
- [ ] Time taken
- [ ] Tester name

## Acceptance Criteria

- [ ] All test cases pass
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] Data integrity verified
- [ ] User acceptance sign-off

## Sign-Off

- [ ] QA Lead: _______________  Date: _______
- [ ] Product Manager: _______________  Date: _______
- [ ] School Representative: _______________  Date: _______

---

**Test Plan Version:** 1.0
**Last Updated:** June 28, 2026
**Status:** Ready for Trial Deployment
