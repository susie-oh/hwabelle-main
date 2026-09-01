# Hwabelle in Bloom — Moderator Standard Operating Procedure (SOP)

## Purpose
This document provides standard operating procedures for reviewing, editing, approving, publishing, featuring, archiving, and handling rights withdrawal for community pressed-flower creations.

---

## 1. Accessing the Queue
1. Log in to the Admin Dashboard at `/admin/login`.
2. Navigate to **Community UGC** in the left sidebar (`/admin/community`).
3. Use the status tabs to view submissions:
   - **Pending Review**: New submissions needing attention.
   - **Approved**: Drafts approved by moderators, ready for Admin publication.
   - **Published**: Live community creations.
   - **Changes Requested / Rejected / Archived**: Historical submissions.

---

## 2. Reviewing a Submission
Click **Review & Edit →** on any row to open the two-panel moderation workspace:
- **Left Panel (Original Submission)**: Displays the raw, immutable customer submission including submitter name, email, order reference, consent timestamp, and media previews.
- **Right Panel (Sanitized Public Copy)**: The workspace where you prepare the public-facing version.

### Checklist before Approving:
- [ ] **Name & Attribution**: Ensure the display name is appropriate (e.g. "Eleanor W.").
- [ ] **Story Quality**: Polish grammar or spelling if needed, preserving the creator's authentic tone.
- [ ] **Botanical Accuracy**: Verify flowers mentioned match the category and imagery.
- [ ] **Imagery Quality**: Verify that images are clear, well-lit, and showcase pressed flower keepsakes or pressing in progress.
- [ ] **Content Safety**: Reject any inappropriate, offensive, or infringing media.
- [ ] **Labeling**: If submitting team-created or seeded projects, set **Source Label Type** to `Created by Hwabelle Team` or `Inspiration Project`.

---

## 3. Moderation Actions

### Action A: Approve & Prepare Draft
- Click **Approve & Prepare Draft**.
- This copies the media into the public CDN bucket and initializes the sanitized publication draft.
- The submission moves to `Approved`.

### Action B: Publish to Live Gallery (Admin Only)
- Ensure all public copy fields, alt text, and SEO titles are filled.
- **Video Creations**: Verify that the video caption/transcript checkbox is checked and transcript entered. Publication is blocked if captions are missing.
- Click **Publish to Live Gallery**.
- The creation immediately goes live at `https://hwabelle.shop/community/[slug]` and appears in the gallery and homepage feed.
- An automated publication notification email is dispatched to the creator with their permanent feature link and social share buttons.

### Action C: Request Changes
- If the submission needs higher-resolution photos or clarification, enter a note and click **Request Changes**.

### Action D: Reject
- If the submission violates guidelines, copyright, or quality standards, enter a reason and click **Reject**.

### Action E: Archive / Unpublish (Admin Only)
- If a customer requests removal or an item is seasonal/outdated, click **Unpublish / Archive**.
- The creation is immediately removed from the public gallery, homepage, and sitemaps.

---

## 4. Rights Complaints & Emergency Withdrawal
If a copyright holder or user requests emergency removal:
1. Locate the submission in `/admin/community`.
2. Click **Unpublish / Archive** immediately.
3. The live page will return a graceful archived state and remove the content from all feeds.
4. Record the complaint details in the moderation notes.
