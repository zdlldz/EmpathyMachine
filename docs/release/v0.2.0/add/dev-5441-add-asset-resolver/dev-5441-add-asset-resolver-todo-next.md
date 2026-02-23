# To-Do Next: Media Ecosystem Evolution

## High Priority
- [ ] **DEV-5439: Mirror Web View:** Initialize the thin-client architecture and verify `MediaLibraryView` renders in-browser using the Asset Resolver.
- [x] **Drag & Drop:** Implement `frontend/src/lib/components/blocks/dropzone.svelte` for seamless media ingestion. (Done in DEV-5442)


## Medium Priority
- [ ] **AI Metadata:** Create a `VisionWorker` to auto-tag images/videos via the `DerivativeWorker` pipeline.
- [ ] **Collection Support:** Implement logical "Collections" (Virtual Folders) in the VFS that can group assets across different physical providers.

## Low Priority (Roadmap)
- [ ] **Public Sharing:** Implement a "Share" mutation that generates a long-lived, signed R2 URL for external viewing.
- [ ] **Video Filmstrips:** Generate a "sprite sheet" of thumbnails for frame-accurate scrubbing in the UI.
