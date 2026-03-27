# Project Blueprint: EventFlow 🚀

**Project Title:** EventFlow - The Cosmic Luxury Event Management Platform
**Domain:** Database Management Systems (DBMS), Full-Stack Web Development, UX/UI Design 

## 1. Project Abstract & Objectives
EventFlow is a premium, high-performance web application designed to manage and discover luxury, technology, and entertainment events. The primary objective is to solve the complexities of modern event ticketing by providing a deeply immersive, 3D-integrated user interface while maintaining a strictly secure, highly relational database backend to track transactions, digital tickets, and physical check-ins with absolute precision.

## 2. Technology Stack
*   **Frontend Framework:** Next.js 14 (App Router), React.js
*   **UI/UX Design:** Tailwind CSS, Aceternity UI, Glassmorphism Aesthetics
*   **3D / Animations:** Three.js (WebGL), React Three Fiber, Framer Motion, GSAP
*   **Backend Runtime:** Node.js, Next.js Server Actions & API Routes
*   **Database Management (DBMS):** MySQL (hosted via XAMPP)
*   **Object-Relational Mapping (ORM):** Prisma Client
*   **Authentication & Security:** NextAuth.js (v5), Custom Credentials Provider, Node.js Crypto (Password Hashing)

## 3. Database Architecture (DBMS Schema Design)
The core of EventFlow relies on a strongly typed, relational MySQL schema designed to prevent data anomalies and ensure transaction integrity via strict Foreign Key Constraints.

### Core Entities & Relationships:
1.  **User (`User` Model):**
    *   *Attributes:* `id` (Primary Key), `email`, `password`, `name`, `role` (ADMIN vs ATTENDEE), `createdAt`.
    *   *Relations:* 1-to-Many with `Ticket` and `Payment`.

2.  **Event (`Event` Model):**
    *   *Attributes:* `id` (PK), `title`, `description`, `date`, `location`, `capacity`, `price`, `status` (DRAFT/PUBLISHED).
    *   *Relations:* 1-to-Many with `Ticket`, `Payment`, `Speaker`, `Session`, `Review`.

3.  **Ticket (`Ticket` Model):**
    *   *Attributes:* `id` (PK), `qrCode` (Unique), `ticketType`, `paymentStatus`, `checkedIn`, `checkedInAt`.
    *   *Foreign Keys:* `userId`, `eventId`. (Enforces that a ticket cannot exist without a valid User and Event).

4.  **Payment (`Payment` Model):**
    *   *Attributes:* `id` (PK), `amount`, `status`, `stripeId` (Reference hash).
    *   *Foreign Keys:* `userId`, `eventId`.

## 4. Key Functional Modules
### A. The Immersive Landing & Discovery Module
*   **Dynamic Data Feeds:** Utilizes Next.js Server Components to fetch and inject live events from the database directly into the 3D-animated hero cards upon page load (Zero-latency SSR).
*   **Starfield Engine:** A localized WebGL component running 3,000 independent mathematical vectors natively in the canvas to simulate space travel, carefully isolated to the homepage to protect downstream rendering speeds.

### B. Secure Ticketing & Guest Checkout
*   **Constraint Resolution Engine:** Custom backend logic `/api/checkout` that safely handles unexpected guest inputs. If a user bypasses authorization, the system dynamically registers a secure Guest Profile on the fly without violating Prisma Foreign Keys.
*   **Cryptographic Pass Generation:** Auto-generates globally unique `qrCode` hashes (e.g., `EVFTCKT_1739...`) upon successful payment verification.

### C. The Attendee Dashboard
*   **Split-Sidebar Interface:** A protected route giving authenticated users access to their Digital Wallet, Ticketing History, and upcoming transit schedules.
*   **Session Management:** Powered by NextAuth.js, utilizing JWT tokens secured against CSRF and XSS attacks to recognize returning users safely.

### D. The Admin Command Center
*   **Telemetry Overview:** A high-density dashboard aggregating live data via `COUNT` and `SUM` SQL aggregations to calculate total platform revenue, total registered attendees, and active events.
*   **Event Lifecycle Management (CRUD):** A secure GUI allowing Administrators to Create, Read, Update, and globally Delete (cascading) events from the database.
*   **Real-time Attendee Manifest:** Displays a massive array of all global participants with a built-in "Smart Sorting" client-side array filter to instantly isolate ticket holders by specific events for high-speed physical entry check-ins.

## 5. Security Protocols & Performance Optimizations
*   **Password Hashing:** Native `crypto.pbkdf2Sync` algorithm applied to protect user passwords against raw database breaches.
*   **Next.js Caching:** Strategic removal of global `unstable_noStore` caching in favor of isolated component hydration to ensure pages like the Home Directory load statically while Dashboards load dynamically.
*   **SQL Connection Pooling:** Passed 100-concurrent-request execution stress tests without crashing the MySQL daemon, proving database resiliency under massive traffic spikes (simulating ticket drop frenzies).

## 6. Future Scope
*   Integration of physical QR-Code scanning hardware for the `Admin` check-in module.
*   Expanding the `Messages` hub into a live WebSocket architecture using Socket.io or Pusher.
*   Implementing email automation (Resend/SendGrid) for physical delivery of the dynamically generated PDF tickets.
