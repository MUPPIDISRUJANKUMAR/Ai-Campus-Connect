# User Deduplication Script

This script helps clean up duplicate user documents in Firestore by merging them into a single canonical document based on the Firebase Auth UID.

## Prerequisites

1. Install the Firebase Admin SDK:

```bash
npm install firebase-admin
```

2. Download your Firebase Admin service account key:

   - Go to Firebase Console
   - Project Settings > Service Accounts
   - Generate New Private Key
   - Save the JSON file securely in your project (don't commit it to version control)

3. Install TypeScript dependencies if not already installed:

```bash
npm install -D typescript @types/node
```

## Running the Script

1. First, ensure you have a backup of your Firestore database
2. Update the path to your service account JSON file in the script
3. Run the script:

```bash
# Compile TypeScript
npx tsc scripts/deduplicate-users.ts

# Run the compiled JavaScript
node scripts/deduplicate-users.js
```

## What the Script Does

1. Fetches all user documents from Firestore
2. Groups documents by email address
3. For each group of duplicates:
   - Identifies the canonical document (matching Firebase Auth UID)
   - Merges fields from duplicates into the canonical document
   - Deletes the duplicate documents
4. Preserves the most recent timestamps and merges arrays (skills, interests)

## Safety Measures

- The script identifies the canonical document as the one with an ID matching the Firebase Auth UID
- Uses Firestore merge to prevent data loss
- Maintains the most recent timestamp values
- Combines array fields without duplicates

## After Running

1. Verify that users can still log in
2. Check that profile data is preserved
3. Confirm that duplicates are removed
4. Update your security rules to prevent future duplicates:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null
                   && userId == request.auth.uid
                   && !exists(/databases/$(database)/documents/users/$(userId));
      allow update: if request.auth != null && userId == request.auth.uid;
      allow read: if request.auth != null;
    }
  }
}
```
