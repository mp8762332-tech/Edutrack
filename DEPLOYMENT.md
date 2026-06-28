# EduTrack School Management System - Deployment Guide

## Overview

EduTrack is a production-ready, multi-tenant school management system optimized for Ugandan school structures. This guide covers deployment to Vercel (frontend) and Supabase (backend).

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                        │
│  React 19 + Tailwind 4 + tRPC Client                       │
│  - Landing page                                             │
│  - Author dashboard (school registration)                   │
│  - School admin dashboard                                   │
│  - Teacher dashboard (marks, attendance)                    │
│  - Student dashboard (results, reports)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Vercel Edge Functions (API)                    │
│  Express 4 + tRPC 11 + Node.js 22                          │
│  - Authentication (Manus OAuth)                             │
│  - tRPC procedures (type-safe RPC)                          │
│  - Database queries                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PostgreSQL
                     │
┌────────────────────▼────────────────────────────────────────┐
│            Supabase (Backend Database)                      │
│  PostgreSQL + Vector Extensions                             │
│  - Schools, Users, Classes, Students, Teachers             │
│  - Marks, Report Cards, Attendance, Timetables             │
│  - Indexed for performance (<100MB mobile)                 │
└─────────────────────────────────────────────────────────────┘
```

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.production` with:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Database (for fallback)
DATABASE_URL=postgresql://user:password@host:5432/school_management

# Manus OAuth
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
JWT_SECRET=your-jwt-secret

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# Owner Info
OWNER_OPEN_ID=your-open-id
OWNER_NAME=Your Name

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 2. Database Migrations

Run Drizzle migrations to create tables:

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration to Supabase
# Use Supabase SQL editor to run generated SQL
```

### 3. Performance Indexes

Apply recommended indexes for optimal performance:

```bash
# Run from server/performance.ts
# Indexes are created for:
# - schools.code, schools.owner_id
# - users.school_id, users.role, users.email
# - classes.school_id, classes.level
# - students.class_id, students.school_id
# - marks.student_id, marks.exam_type, marks.created_at
# - attendance.student_id, attendance.date
# - timetables.class_id, timetables.type
```

## Deployment Steps

### Step 1: Prepare Frontend (Vercel)

```bash
# Install dependencies
pnpm install

# Build frontend
pnpm run build

# Test build locally
pnpm run preview
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Settings → Environment Variables
```

### Step 3: Deploy Backend (Vercel Edge Functions)

Backend is automatically deployed with frontend when using `server/` directory.

```bash
# Verify API is working
curl https://your-domain.vercel.app/api/trpc/auth.me
```

### Step 4: Configure Supabase

1. Create Supabase project
2. Run migrations
3. Apply performance indexes
4. Configure Row Level Security (RLS) policies
5. Set up storage buckets

### Step 5: Test Deployment

```bash
# Test authentication
curl -X POST https://your-domain.vercel.app/api/oauth/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"test-code"}'

# Test database connection
curl https://your-domain.vercel.app/api/trpc/schools.list

# Test file upload
curl -X POST https://your-domain.vercel.app/api/upload \
  -F "file=@test.pdf"
```

## Performance Optimization

### Frontend (<100MB mobile)

- Code splitting with React.lazy()
- Image optimization (WebP, AVIF)
- CSS minification (Tailwind purge)
- JavaScript minification
- Gzip compression

### Backend (<500MB desktop)

- Database query optimization with indexes
- Lazy loading with pagination (50 items/page)
- Batch loading to prevent N+1 queries
- Query result caching (5 min - 24 hours)
- Connection pooling

### Database

- Indexed columns for fast lookups
- Partitioning for large tables (marks, attendance)
- Archival of old data (>2 years)
- Vacuum and analyze regularly

## Monitoring & Maintenance

### Health Checks

```bash
# API health
curl https://your-domain.vercel.app/health

# Database connection
curl https://your-domain.vercel.app/api/trpc/health.db

# Storage health
curl https://your-domain.vercel.app/api/trpc/health.storage
```

### Logs

- Vercel: Dashboard → Logs
- Supabase: Dashboard → Logs
- Client: Browser DevTools → Console

### Alerts

Set up alerts for:
- API error rate > 5%
- Database query time > 1s
- Storage usage > 80%
- Failed deployments

## Scaling Strategy

### Phase 1: Single Region (Current)
- Vercel: US region
- Supabase: US region
- Expected: 1,000 schools, 100,000 students

### Phase 2: Multi-Region
- Vercel: US + EU + Asia
- Supabase: Replication to multiple regions
- Expected: 10,000 schools, 1,000,000 students

### Phase 3: Enterprise
- Dedicated Supabase instance
- CDN for static assets
- Load balancing
- Database sharding

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check `DATABASE_URL` environment variable
2. Verify Supabase project is running
3. Check firewall rules allow Vercel IP ranges
4. Test connection: `psql $DATABASE_URL`

### Issue: "Authentication loop"

**Solution:**
1. Verify `VITE_OAUTH_PORTAL_URL` is correct
2. Check OAuth callback URL matches Manus settings
3. Clear browser cookies
4. Check JWT_SECRET is consistent

### Issue: "File upload fails"

**Solution:**
1. Verify Supabase storage bucket exists
2. Check storage RLS policies
3. Verify file size < 50MB
4. Check CORS settings

### Issue: "Slow page load"

**Solution:**
1. Check database indexes are created
2. Verify lazy loading is working
3. Check network tab for large assets
4. Run performance audit: `lighthouse`

## Rollback Plan

If deployment fails:

```bash
# Rollback Vercel to previous deployment
vercel rollback

# Rollback database (Supabase)
# Use backup restore feature in Supabase dashboard

# Rollback environment variables
# Revert to previous .env values
```

## Post-Deployment

### 1. Verify All Features

- [ ] Login with different user roles
- [ ] Create school and students
- [ ] Record marks and generate report cards
- [ ] Print and download PDF
- [ ] Share via WhatsApp
- [ ] View attendance
- [ ] Check timetable
- [ ] Test file uploads

### 2. Security Audit

- [ ] Enable HTTPS everywhere
- [ ] Set up CORS correctly
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable 2FA for admin accounts

### 3. Backup Strategy

- [ ] Daily database backups
- [ ] Weekly full backups
- [ ] Monthly archive backups
- [ ] Test restore procedure monthly

### 4. Documentation

- [ ] Update API documentation
- [ ] Create user guides
- [ ] Document troubleshooting steps
- [ ] Create admin runbooks

## Support & Maintenance

### Regular Tasks

- **Daily**: Monitor error rates, check logs
- **Weekly**: Review performance metrics, update documentation
- **Monthly**: Security audit, backup verification
- **Quarterly**: Performance optimization, feature updates

### Contact

- Issues: support@edutrack.ug
- Emergencies: +256 XXX XXXX XXX
- Documentation: https://docs.edutrack.ug

## License

EduTrack is proprietary software. All rights reserved.

---

**Last Updated:** June 28, 2026
**Version:** 1.0.0
**Status:** Production Ready
