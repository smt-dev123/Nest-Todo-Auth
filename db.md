```
model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String
tasks Task[]
createdAt DateTime @default(now())
}
```

```
model Task {
id Int @id @default(autoincrement())
userId Int
title String
description String?
status String @default("pending")
dueDate DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
