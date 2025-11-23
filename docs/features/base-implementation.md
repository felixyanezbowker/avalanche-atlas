### FRED - Feature Requirement Document

1. **Feature Name**: Avalanche Atlas

-------

1. **Goal**: The single most important thing in the backcountry is understanding how the mountain is behaving and where avalanches have recently been triggered. Every year, around 100,000 avalanches occur worldwide, and north of 99% of them go unreported. In most countries, avalanche bulletins are produced by government agencies and focus on general conditions and snowpack, rather than listing specific, recent avalanche events.

This app flips that. It lets users report avalanches they’ve seen or triggered, submit key details about each incident, and upload them to a public, dashboard that anyone can view. Before heading into the backcountry, riders can quickly check which avalanches have occurred nearby and when, and use that crowd-sourced information as an extra decision-making tool. More shared knowledge leads to more informed choices, which results in greater safety and hopefully, fewer deaths.

---

1. **User Story**: As a winter sports adventurer, I want to see recent avalanche reports on a public dashboard, so that I can better understand current conditions and make safer decisions in the mountains.

---

1. **Functional Requirements**: 
- users can create an account via a gmail login or by inputting their email address and selecting a password
- Submit avalanche report: Users can submit a new avalanche report via a form with the following fields: location (which is a drop-down list of all regions in Andorra, listed IN SECTION 5 BELOW), slope aspect (dropdown list of N, NE, E, SE, S, SW, W, NW), date & time, elevation, avalanche size, cause, photo upload, map link (e.g. Mapy.com URL) and additional comments. Required fields: location, slope aspect, date, avalanche size, cause. The avalanche report will have one cover photo, and then the user inputting the incident will have the ability to upload multiple photos or videos.
- Store report with reporter identity: Each submitted report is saved to the database with a unique ID, creation timestamp and reporter email.
- View list of recent avalanches:  Home screen shows a list of all reports in reverse-chronological order (newest first). Each list item displays: thumbnail image (if any), date, location, aspect and elevation.
- View avalanche report details: Tapping a list item opens a detail view showing all report fields, including full-size photo and additional comments.
- Map integration: From the detail view, “View on Map” opens the map link (e.g. Mapy.com URL) in a browser or in-app web view.
- Share report: From the detail view, “Share Report” generates a shareable link that can be sent via system share sheet (WhatsApp, email, etc.).
- Contact reporter: From the detail view, “Contact Reporter” opens the device’s default email client pre-filled with the reporter’s email address.
- Edit report (MVP: owner / admin only): “Edit Details” allows the report owner or an admin to update any field of an existing report and save changes.
- Comment on report: Users can add text comments to a report. Comments are displayed in a list under the report, ordered by time, with a basic text search box to filter comments.
- Submit button access: A persistent “Submit” button is visible from the main navigation so users can submit a new report from anywhere in the app within one tap.

---

1. **Data Requirements** (optional):

**`avalanches`**

Stores each submitted avalanche report.

- `id` (uuid, PK, default `gen_random_uuid()`)
- `created_at` (timestamptz, default `now()`) – when the report was submitted
- `reported_at` (timestamptz) – when the avalanche occurred
- `location_name` (text) – e.g. “Vall del Madriu”
- `region` (text) – e.g. “Ordino Arcalis, Pal, Arinsal, Soldeu, El Tarter, Pas de la Casa, Grau Roig, Comapedrosa, Sorteny, Ransol, Vall del Madriu, Incles”
- `elevation_m` (integer)
- `slope_aspect` (enum: `N, NE, E, SE, S, SW, W, NW`)
- `avalanche_size` (integer or enum 1–5)
- `avalanche_size_label` (text) – e.g. “2/5 – Small (could bury/injure someone)”
- `trigger_type` (enum: `natural, accidental, remote, unknown`)
- `map_url` (text) – Mapy.com (or other) link
- `photo_url` (text) – public URL to image in Supabase Storage
- `additional_comments` (text)
- `reporter_id` (uuid, FK → `auth.users.id`)
- `reporter_name` (text, denormalised for quick display/contact)
- `is_public` (boolean, default `true`)

**`comments`**

Stores user comments on specific avalanche reports.

- `id` (uuid, PK)
- `avalanche_id` (uuid, FK → `avalanches.id`, indexed)
- `user_id` (uuid, FK → `auth.users.id`)
- `body` (text)
- `created_at` (timestamptz, default `now()`)
- `is_public` (boolean, default `true`)

Relationships

- One **user** (`auth.users`) → many **avalanches** (`avalanches.reporter_id`).
- One **avalanche** → many **comments** (`comments.avalanche_id`).
- One **user** → many **comments** (`comments.user_id`).
- *(Optional)* One **area** → many **avalanches** (`avalanches.area_id`).

---

1. **User Flow:
User Flow #1 - Checks Avalanches before a tour:**
- User opens the app.
- By default, the **Home / Recent Avalanches** list is shown.
- User scrolls the list of reports (ordered newest first).
- User taps a report card to see full details.
- The **Avalanche Detail** screen opens, showing photo, date & time, location, elevation, size, aspect, cause and additional comments.
- (Optional) User taps **View on Map** to open the map link in a browser/web view.
- (Optional) User taps **Share Report** to share a link via the system share sheet.
- (Optional) User taps **Contact Reporter** to open an email draft to the reporter.
- User returns to the list or closes the app and decides on their tour with this extra information.

User Flow #2 – User submits a new avalanche report

- User opens the app.
- User taps the **Submit** button in the top-right or the **Submit** item in the side menu.
- The **Submit Avalanche** form opens.
- User fills in required fields:
    - Location
    - Slope aspect
    - Date observed
    - Avalanche size
    - Cause of the slide
- User optionally fills in: elevation, map link, additional comments.
- User taps **Upload Photo** and selects an image from their device.
- User reviews the form and taps **Submit**.
- The app saves the report and shows a brief confirmation.
- User returns to the **Recent Avalanches** list, where the new report now appears at the top.

---

1. **Acceptance Criteria**
- **Recent Avalanche List**
    - When there are approved reports in the database, opening the app shows a “Recent Avalanches” list sorted by most recent `reported_at` first.
    - Each list item displays at minimum: date, location name, slope aspect and elevation.
    - If a photo exists, a thumbnail is shown; if not, the layout still renders cleanly.
- **View Avalanche Details**
    - Tapping any item in the list opens a detail view for that specific report.
    - The detail view shows all stored fields for that report (photo, date & time, location, elevation, size, aspect, cause, comments, reporter email, map link if present).
    - Optional fields that are null are simply hidden and do not break the layout.
- **Submit Avalanche Report**
    - From any screen, the user can reach the “Submit” form in one tap.
    - Required fields (location, slope aspect, date, avalanche size, cause) are clearly marked and cannot be left empty.
    - If a required field is missing or invalid, the user sees an inline error and the report is not submitted.
    - When all required fields are valid and the user taps “Submit” with a working connection, a new record is created in the `avalanches` table with a unique ID, `reporter_id` and `created_at`.
    - The newly created report appears in the “Recent Avalanches” list within 5 seconds of submission.
- **Photo Upload**
    - Users can attach a photo up to the agreed size limit and supported formats (e.g. JPG, PNG).
    - If the upload fails, the user sees a clear error and can retry or submit without a photo.
- **Map & Links**
    - If a `map_url` is present, tapping “View on Map” opens that URL in a browser or in-app web view.
    - If `map_url` is missing, the “View on Map” button is hidden or disabled.
- **Share & Contact**
    - Tapping “Share Report” triggers the system share sheet with a valid, openable URL to that report.
    - Tapping “Contact Reporter” opens the default email client with the “To” field prefilled with `reporter_email`.
    - If no `reporter_email` is stored, “Contact Reporter” is hidden or disabled.
- **Comments**
    - Users can submit a text comment on a report and it is stored in the `comments` table linked to that `avalanche_id`.
    - New comments appear in the comments list under the report within 3 seconds.
    - The UI handles reports with zero, one or many comments without layout issues.
- **Editing Reports (MVP rule)**
    - Only the report owner (matching `reporter_id`) or an admin account can see and use the “Edit Details” button.
    - Editing and saving updates the corresponding fields in the `avalanches` record and the changes are reflected in both the detail view and list view.
- **Error Handling & Reliability**
    - If network connectivity is lost during submission, the user sees a clear error message and no duplicate reports are created when they retry.
    - All screens render without crashes when optional fields are empty or when no data exists in the system.
- **Performance**
- With up to 100 avalanche reports in the database, the “Recent Avalanches” list loads in under 3 seconds on a typical 4G mobile connection.

---

1. **Edge Cases**: Tricky scenarios to handle
- Partial / low-quality reports
    - User submits without photo, map link, or elevation.
    - User enters vague or incorrect location names.
- Location & map issues
    - GPS is unavailable or inaccurate (no coordinates).
    - Map link is missing, broken, or not in the expected format.
    - Same avalanche reported multiple times by different users.
- Time & date inconsistencies
    - Avalanche time is in the future or far in the past.
    - User device is on the wrong timezone or date.
- Photo upload problems
    - Image upload fails due to poor connection.
    - File is too large or in an unsupported format.
    - User submits with no photo after a failed upload.
- Connectivity / offline states
    - User loses signal while filling the form or tapping Submit.
    - Report is created twice due to retries after a failed submission.
- Data integrity & moderation
    - Obvious spam / trolling / fake avalanche reports.
    - Offensive or irrelevant content in comments or description.
    - Reporter later realises details are wrong and needs to edit or flag the report.
- Permissions & identity
    - Reporter is not logged in or their session expires mid-submission.
    - Email is missing or invalid, so “Contact reporter” should be disabled.
- List / detail view failures
    - Report exists but some optional fields are null (UI must still render cleanly).
    - Linked map page or share link cannot be opened.
- Scalability & filtering
    - Very high number of reports in the same area/day (list and map must remain usable).
    - Users trying to filter by date/area/aspect when limited data is available.
    
    ---
    
1. **Non-Functional Requirements**

(Optional): Performance, security, UX constraints

**Performance**

- Recent avalanche list must load in under **3 seconds** with up to **100 reports** on a typical 4G mobile connection.
- Submitting a report (including photo upload) should complete in under **10 seconds** on a typical 4G connection, or show clear progress/error states.
- Detail view must open in under **2 seconds** from the list.

**Reliability & Availability**

- The app should handle intermittent connectivity gracefully, with clear error messages and no duplicate submissions.
- Service should target **99% uptime** during the winter season in the primary regions (e.g. Andorra / Pyrenees).

**Security & Privacy**

- All data requests must go over **HTTPS**.
- Access to create/edit reports and comments must be tied to authenticated Supabase users.
- Reporter email addresses are visible in the UI only where explicitly needed (“Contact reporter”) and are not exposed via unauthenticated APIs.
- Role-based access control (RBAC) must be enforced for admin actions (e.g. editing any report, moderating spam).

**UX & Usability**

- Primary flows (view recent avalanches, submit report) must be achievable in **≤3 taps** from the home screen.
- The interface must be readable and usable on standard mobile screens (min width 360px) used in the field, with large tap targets suitable for gloved/rough use.
- The app should remain usable with missing optional data (no photos, no coordinates, etc.) without broken layouts.

**Compatibility**

- MVP must work smoothly in modern mobile browsers (Safari iOS, Chrome Android) and desktop browsers (Chrome, Safari, Edge, Firefox).
- Map links must open correctly in the system browser or map app if installed.

**Logging & Monitoring**

- Basic logging must be in place for failed submissions, failed image uploads, and unexpected errors, so that issues in the field can be debugged.