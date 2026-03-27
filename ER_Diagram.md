# EventFlow Entity-Relationship (ER) Diagram 📊

This file contains the strict relational database mapping and cardinality rules for the EventFlow MySQL Database. 
You can paste the code block below into [Mermaid Live Editor](https://mermaid.live/) to instantly generate a professional diagram graphic for your project report!

```mermaid
erDiagram
    %% Core Relationships (Cardinality)
    USER ||--o{ TICKET : "purchases"
    USER ||--o{ PAYMENT : "makes"
    USER ||--o{ REVIEW : "writes"
    
    EVENT ||--o{ TICKET : "issues"
    EVENT ||--o{ PAYMENT : "tracks revenue for"
    EVENT ||--o{ SPEAKER : "hosts"
    EVENT ||--o{ SESSION : "schedules"
    EVENT ||--o{ REVIEW : "receives feedback on"

    %% Entity Structures & Data Types
    USER {
        string id PK "Unique CUID"
        string name
        string email
        string password "Hashed via pbkdf2Sync"
        string role "ADMIN or ATTENDEE"
        datetime createdAt
        datetime updatedAt
    }

    EVENT {
        string id PK "Unique CUID"
        string title
        text description
        datetime date
        string location
        int capacity
        float price
        string status "DRAFT or PUBLISHED"
        datetime createdAt
    }

    TICKET {
        string id PK "Unique CUID"
        string userId FK "References USER.id"
        string eventId FK "References EVENT.id"
        string qrCode "Unique Hash String"
        string ticketType "e.g., VIP Pass, Standard"
        string paymentStatus "e.g., paid, pending"
        boolean checkedIn
        datetime checkedInAt
        datetime createdAt
    }

    PAYMENT {
        string id PK "Unique CUID"
        string userId FK "References USER.id"
        string eventId FK "References EVENT.id"
        float amount
        string status
        datetime createdAt
    }

    SPEAKER {
        string id PK "Unique CUID"
        string eventId FK "References EVENT.id"
        string name
        string role "Job Title"
        string company
        string bio
        datetime createdAt
    }

    SESSION {
        string id PK "Unique CUID"
        string eventId FK "References EVENT.id"
        string title
        text description
        datetime startTime
        datetime endTime
        datetime createdAt
    }


```
