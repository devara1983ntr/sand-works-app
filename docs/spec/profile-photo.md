# Profile Photo — SAND WORKS

Status: **SPECIFIED (plan-dependent).** Every OWNER, DRIVER and LABOURER has a profile screen supporting profile info and, where the chosen Firebase architecture supports it, a profile picture.

## 1. Plan dependency (honest)
Profile-photo storage uses **Firebase Storage**. Storage availability depends on the Firebase plan. If Storage requires a paid (Blaze) plan, this feature is marked a **plan/environment dependency** and is not represented as available on a free plan. The rest of the profile (name/role/phone/status) is available regardless.

## 2. User flows
- **Upload:** choose image (gallery/camera per Android), preview, then confirm.
- **Replacement:** overwrite the user's own current photo.
- **Deletion:** remove the user's photo.
- All within own scope (each user edits their own photo); owner may manage their own.

## 3. Validation & processing
- Image validation: format (jpg/png/webp), MIME, dimensions (min/max documented), file size limit (documented, e.g. ≤ 5 MB original).
- Server/enforcement: Storage rules validate size/MIME/dimensions and that the path is the caller's own.
- Compression and crop before upload (client-side) to a documented max dimension.

## 4. Upload UX
- Loading indicator; upload progress; success; failure with retry; cancellation.
- Never show "photo saved" unless storage accepted it.
- Network failure → honest error + retry.

## 5. Authorization & privacy
- Read: the user's own photo (and, where shown in owner/leaderboard contexts, only approved thumbnails as permitted). No arbitrary cross-user private image disclosure.
- Write/delete: the user's own record only.
- Storage rules enforce owner/self.

## 6. Storage lifecycle
- On replacement/deletion, the old object is removed (or GC'd) per documented policy.
- Photo referenced by uid path: `profiles/{orgId}/{uid}`.

## 7. Failure handling
- Oversized / wrong type / invalid dims → validation error before upload.
- Upload failure → error state, no silent success, retry available.
