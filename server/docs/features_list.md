# Application Features & User Stories

This document outlines the comprehensive list of tasks, features, and user stories for the application. The application is designed for a single universal user type who can act as both a Seeker (needs a service) and a Provider (gives a service).

**Legend:**
- [x] Completed
- [/] In Progress
- [ ] Planned / To Do

## ⭐ UNIVERSAL USER JOURNEY (Everyone is both Seeker & Provider)
*(This replaces separate onboarding for seeker/provider)*

### A. Onboarding & Account Setup (COMMON)
- [x] **Register Account** (Email/Password)
- [x] **Login** (JWT Authentication)
- [ ] **Email/Phone Verification**
- [x] **Complete Basic Profile**
    - [x] Name, Bio, Location
    - [x] Profile photo (Avatar URL)
    - [x] Skills & Preferences
    - [x] Contact & Social Links
    - [ ] ID verification (optional but boosts trust)
- [ ] **Set Default Role Preferences**
    - User chooses what they usually do (Seeker / Provider / Both)
    - *Note: They can switch at any time*
- [ ] **Add Payment Method** (optional but encouraged)
- [ ] **Set Service Area / Location Preferences**

---

## ⭐ SECTION 1 — USER JOURNEY AS SERVICE SEEKER
*(Every user can act as a seeker at any time)*

### B. Explore & Browse Posts
- [x] **Browse Job/Service Feed**
    - Mixture of service listings & job requests posted by users.
    - [x] "Recommended for You" Feed
    - [x] "Recent Jobs" Feed
- [/] **Filters for Discovery**
    - [x] Category
    - [x] Search (Title/Description)
    - [ ] Price range
    - [ ] Distance
    - [ ] Ratings
    - [ ] Availability
- [ ] **Map View / Location View**
    - Locate provider jobs or candidates on map
    - See exact location when allowed
- [x] **View Post Details**
    - [x] Description, Pay, Date/Time
    - [x] Seeker Details (Rating, Member Since)
    - [x] Location (General vs Exact privacy)
- [/] **Save a Post** (UI Implemented, Mock Functionality)
- [/] **Share a Post** (UI Implemented, Mock Functionality)
- [ ] **Report a Post**
    - Wrong info, fraud, inappropriate, etc.

### C. Create & Manage Job Request
- [x] **Create a Job Post**
    - [x] Category
    - [x] Description & Title
    - [x] Budget (Hourly/Fixed)
    - [x] Date/time
    - [x] Location (General & Exact)
    - [ ] Photos
- [ ] **Edit or Update Job Post**
- [ ] **Pause or Resume Post Visibility**
- [ ] **Delete Job Post**
- [x] **View Posted Jobs** (My Activity -> Posted Jobs)

### D. Interactions With Providers
- [x] **Receive Interests from Providers** (View Offers on Job Details)
- [x] **View Providers Who Showed Interest**
- [/] **Negotiate with Providers**
    - [x] Receive Offer Amount & Message
    - [x] Accept Offer
    - [ ] Counter-offer
    - [ ] Chat History
- [x] **Choose & Confirm a Provider** (Accept Offer)
- [ ] **Cancel Engagement Before Service**
- [ ] **Track Provider (live/approx) Before Arrival**

### E. Payments & Service Management
- [ ] **Select Payment Option**
- [ ] **Pay Deposit or Full Payment** (depending on model)
- [ ] **Receive Invoice**

### F. During the Service
- [ ] **Chat with Provider**
- [ ] **Receive Status Updates**
    - On the way
    - Started
    - In progress
    - Completed

### G. Completion & Ratings
- [ ] **Approve Completion**
- [ ] **Release Payment**
- [ ] **Rate Provider**
- [ ] **Write Review**
- [ ] **Provider Can Respond to Negative Reviews**
- [ ] **View Own Seeker Rating Summary**

### H. Support
- [ ] **Raise a Dispute**
- [ ] **Request Refund**

---

## ⭐ SECTION 2 — USER JOURNEY AS SERVICE PROVIDER

### J. Browse Available Job Requests
- [x] **Browse Job Requests Feed**
- [/] **Apply Filters**
    - [x] Category
    - [ ] Budget
    - [ ] Distance
    - [ ] Date
- [x] **Open Job Details**
- [/] **Locate Job on Map** (UI Implemented, Mock Functionality)
- [/] **Save or Bookmark Job** (UI Implemented, Mock Functionality)
- [/] **Share Job** (UI Implemented, Mock Functionality)

### K. Interact With Seekers
- [x] **Show Interest in a Job** (Express Interest Modal)
- [x] **Negotiate Price with Seeker** (Make Offer Modal)
- [/] **Chat with Seeker** (Message included in Offer)
- [x] **Receive Confirmation from Seeker** (Job Status: Assigned)
- [ ] **Accept or Decline Job Assignment**

### L. Pre-Service Management
- [ ] **View Job Timeline & Requirements**
- [ ] **Mark “On the Way”**
- [ ] **Mark “Arrived”**

### M. During the Service
- [ ] **Start Service Timer** (if used)
- [ ] **Send Progress Updates**
- [ ] **Mark as Completed**

### N. Payments & Earnings
- [ ] **View Expected Earnings per Job**
- [ ] **Receive Payment After Completion**
- [ ] **Wallet Balance Summary**
- [ ] **Withdraw Earnings to Bank/UPI**
- [ ] **View Earnings History**
- [x] **View Work History** (My Activity -> Work History)

### O. Ratings & Community Reputation
- [ ] **Rate Seeker After Job**
- [ ] **Add Feedback for Seeker**
- [x] **View Provider Rating** (Basic Display)
- [x] **View Seeker Rating** (Basic Display)
- [ ] **Respond to Negative Feedback**
    - Justify comment
    - Add clarification

### P. Provider Profile Management
- [ ] **Update Service Areas / Radius**
- [ ] **Update Pricing**
- [ ] **Set Availability Calendar**
- [ ] **Add or Remove Service Categories**
- [ ] **Manage Certifications / Portfolio**
- [x] **View Active Offers** (My Activity -> Active Offers)

---

## ⭐ SECTION 3 — COMMON USER ACTIONS (Both Roles)
*(To avoid duplication)*

### General Features
- [ ] **Universal Chat System** (Real-time)
- [ ] **Push Notifications**
- [ ] **Dark Mode / Light Mode**
- [ ] **Block or Mute Users**
- [x] **View Activity History**
    - [x] Jobs as seeker (Posted Jobs)
    - [x] Jobs as provider (Work History)
- [ ] **Profile Verification Levels**
    - ID verified
    - Address verified
- [ ] **In-app Support / Help Center**

---

## ⭐ SECTION 4 — ADMIN/PLATFORM TASKS
*(For completeness)*

- [ ] **Flagged Content Review**
- [ ] **User Ban/Restriction Tools**
- [ ] **Dispute Resolution Dashboard**
- [ ] **Payment & Transaction Monitoring**
- [ ] **Analytics Dashboard**
