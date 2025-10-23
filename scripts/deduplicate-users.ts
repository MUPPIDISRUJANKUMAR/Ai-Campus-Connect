import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  DocumentData,
} from "firebase-admin/firestore";
import { User as AppUser } from "../src/types";

interface UserDocument extends AppUser {
  id: string;
  authUid?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: any; // Allow dynamic field access
}

const CONFIG = {
  DRY_RUN: true, // Set to false to actually perform the changes
  BATCH_SIZE: 500, // Number of documents to process in each batch
};

// Initialize Firebase Admin with your service account
const serviceAccount = require("../firebase-admin-key.json");

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

async function deduplicateUsers() {
  console.log("Starting user deduplication process...");
  console.log(`Mode: ${CONFIG.DRY_RUN ? "DRY RUN" : "LIVE"}`);

  try {
    // Get all users
    const usersSnapshot = await db.collection("users").get();
    const users: UserDocument[] = usersSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as UserDocument)
    );

    console.log(`Found ${users.length} total user documents`);

    // Group users by email
    const usersByEmail: { [key: string]: UserDocument[] } = users.reduce(
      (acc, user) => {
        if (!user.email) {
          console.warn(`User document ${user.id} has no email address`);
          return acc;
        }
        if (!acc[user.email]) acc[user.email] = [];
        acc[user.email].push(user);
        return acc;
      },
      {} as { [key: string]: UserDocument[] }
    );

    let duplicateCount = 0;
    let processedCount = 0;
    let errorCount = 0;

    // Process each group of duplicates
    for (const [email, duplicates] of Object.entries(usersByEmail)) {
      if (duplicates.length <= 1) continue;

      duplicateCount++;
      console.log(`\nProcessing duplicates for email: ${email}`);
      console.log(`Found ${duplicates.length} documents for this email`);

      // Find the canonical document (matching auth UID)
      const canonical =
        duplicates.find((u) => u.id === u.authUid) || duplicates[0];
      const duplicateDocs = duplicates.filter((u) => u.id !== canonical.id);

      if (duplicateDocs.length === 0) continue;

      console.log(`Using document ${canonical.id} as canonical`);
      console.log(`Found ${duplicateDocs.length} duplicates to merge`);

      try {
        // Merge all fields from duplicates
        const mergedData = duplicateDocs.reduce(
          (acc: UserDocument, dup: UserDocument) => {
            // Merge arrays
            ["skills", "interests"].forEach((field) => {
              if (dup[field] && Array.isArray(dup[field])) {
                acc[field] = [
                  ...new Set([...(acc[field] || []), ...dup[field]]),
                ];
              }
            });

            // Keep most recent timestamps
            if (
              dup.updatedAt &&
              (!acc.updatedAt ||
                dup.updatedAt.toMillis() > acc.updatedAt.toMillis())
            ) {
              acc.updatedAt = dup.updatedAt;
            }

            return acc;
          },
          { ...canonical }
        );

        if (!CONFIG.DRY_RUN) {
          // Update the canonical document
          await db
            .doc(`users/${canonical.id}`)
            .set(mergedData, { merge: true });

          // Delete duplicate documents
          for (const dup of duplicateDocs) {
            await db.doc(`users/${dup.id}`).delete();
          }
        }

        processedCount++;
        console.log("Successfully processed group");
      } catch (error) {
        console.error(`Error processing group for email ${email}:`, error);
        errorCount++;
      }
    }

    console.log("\nDeduplication process completed!");
    console.log("Summary:");
    console.log(`- Total user documents: ${users.length}`);
    console.log(`- Duplicate groups found: ${duplicateCount}`);
    console.log(`- Groups successfully processed: ${processedCount}`);
    console.log(`- Errors encountered: ${errorCount}`);

    if (CONFIG.DRY_RUN) {
      console.log("\nThis was a DRY RUN. No changes were made.");
      console.log("Set CONFIG.DRY_RUN = false to perform the actual changes.");
    }
  } catch (error) {
    console.error("Fatal error during deduplication:", error);
    throw error;
  }
}

// Run the script
deduplicateUsers().catch(console.error);
