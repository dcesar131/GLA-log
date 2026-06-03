* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  background: #f5f0eb;
  min-height: 100vh;
  color: #2d2d2d;
}

.app { min-height: 100vh; }

/* ── TEACHER FORM ── */
.form-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 0 100px;
}

.form-header {
  background: #6B3FA0;
  color: white;
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.gla-badge {
  width: 48px; height: 48px;
  background: #F5A623;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 800; color: white;
  flex-shrink: 0;
}

.form-header h1 { font-size: 20px; font-weight: 700; }
.form-header p { font-size: 13px; opacity: 0.8; margin-top: 2px; }

.form-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

.field-group { display: flex; flex-direction: column; gap: 6px; }

.field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

label {
  font-size: 13px; font-weight: 600;
  color: #5a5a5a; text-transform: uppercase; letter-spacing: 0.04em;
}

.optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: #999; }

input[type="text"], select, textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  background: white;
  color: #2d2d2d;
  transition: border-color 0.2s;
  appearance: none;
}

input[type="text"]:focus, select:focus, textarea:focus {
  outline: none; border-color: #6B3FA0;
}

textarea { resize: none; }

.activity-chip {
  background: #f0eafa;
  color: #6B3FA0;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
}

/* Photo */
.photo-area { width: 100%; }

.photo-buttons { display: flex; gap: 10px; }

.photo-btn {
  flex: 1; padding: 14px;
  background: white; border: 1.5px dashed #ccc;
  border-radius: 10px; font-size: 14px;
  cursor: pointer; font-family: inherit;
  transition: border-color 0.2s, background 0.2s;
}
.photo-btn:hover { border-color: #6B3FA0; background: #f9f6ff; }

.photo-preview { position: relative; }
.photo-preview img {
  width: 100%; border-radius: 10px; max-height: 200px;
  object-fit: cover; display: block;
}
.remove-photo {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,0.55); color: white;
  border: none; border-radius: 6px;
  padding: 4px 10px; font-size: 12px; cursor: pointer;
}

.btn-submit {
  width: 100%; padding: 16px;
  background: #6B3FA0; color: white;
  border: none; border-radius: 12px;
  font-size: 16px; font-weight: 700;
  cursor: pointer; font-family: inherit;
  transition: background 0.2s, transform 0.1s;
  margin-top: 4px;
}
.btn-submit:hover { background: #5a3390; }
.btn-submit:active { transform: scale(0.98); }
.btn-submit:disabled { background: #bbb; cursor: not-allowed; }

.error-msg {
  background: #fff0f0; color: #c0392b;
  border: 1px solid #f5c6c6;
  padding: 10px 14px; border-radius: 8px;
  font-size: 13px;
}

/* Success */
.success-screen {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 100vh; padding: 40px 20px;
  text-align: center;
}

.success-icon {
  width: 72px; height: 72px;
  background: #4CAF50; color: white;
  border-radius: 50%; font-size: 32px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
}

.success-screen h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.success-screen p { color: #666; font-size: 15px; }
.activity-confirm {
  font-weight: 700; color: #6B3FA0 !important;
  font-size: 18px !important; margin: 8px 0 24px !important;
}

.btn-primary {
  padding: 14px 32px;
  background: #6B3FA0; color: white;
  border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700;
  cursor: pointer; font-family: inherit;
}

/* ── ADMIN DASHBOARD ── */
.admin-container {
  max-width: 900px; margin: 0 auto;
  padding: 24px 20px 80px;
}

.admin-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; margin-bottom: 24px;
}

.admin-header h1 { font-size: 22px; font-weight: 700; color: #6B3FA0; }
.admin-header p { font-size: 13px; color: #888; margin-top: 3px; }

.btn-refresh {
  padding: 8px 16px;
  background: white; border: 1.5px solid #ddd;
  border-radius: 8px; font-size: 13px;
  cursor: pointer; font-family: inherit;
  white-space: nowrap;
}
.btn-refresh:hover { border-color: #6B3FA0; color: #6B3FA0; }

.stat-cards {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 12px; margin-bottom: 20px;
}

.stat-card {
  background: white; border-radius: 12px;
  padding: 16px; text-align: center;
  border: 1px solid #eee;
}

.stat-num { font-size: 28px; font-weight: 800; color: #6B3FA0; }
.stat-label { font-size: 12px; color: #888; margin-top: 2px; }

.filters {
  display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
}

.filters input[type="date"],
.filters select {
  padding: 9px 12px; border: 1.5px solid #ddd;
  border-radius: 8px; font-size: 13px;
  background: white; font-family: inherit;
  appearance: none;
}

.filters input[type="date"]:focus,
.filters select:focus { outline: none; border-color: #6B3FA0; }

.loading, .empty-state {
  text-align: center; padding: 40px;
  color: #888; font-size: 15px;
}

.classroom-sections { display: flex; flex-direction: column; gap: 16px; }

.classroom-section {
  background: white; border-radius: 14px;
  border: 1px solid #eee; overflow: hidden;
}

.classroom-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px;
  background: #f9f6ff;
  border-bottom: 1px solid #eee;
}

.classroom-name { font-weight: 700; font-size: 14px; color: #6B3FA0; }
.classroom-count { font-size: 12px; color: #888; }

.log-entries { padding: 8px 0; }

.log-entry {
  display: flex; align-items: center;
  padding: 10px 16px; gap: 12px;
  border-bottom: 1px solid #f5f5f5;
}
.log-entry:last-child { border-bottom: none; }

.log-time {
  font-size: 12px; color: #888;
  width: 64px; flex-shrink: 0;
  font-weight: 600;
}

.log-main { flex: 1; min-width: 0; }
.log-activity { font-size: 14px; font-weight: 600; color: #2d2d2d; }
.log-meta { font-size: 12px; color: #888; margin-top: 2px; display: flex; gap: 4px; flex-wrap: wrap; }
.dot { color: #ccc; }
.log-note { font-style: italic; color: #aaa; }

.log-thumb {
  width: 48px; height: 48px;
  object-fit: cover; border-radius: 8px;
  cursor: pointer; flex-shrink: 0;
  transition: transform 0.15s;
}
.log-thumb:hover { transform: scale(1.05); }

/* Photo modal */
.photo-modal {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; flex-direction: column; gap: 16px;
  cursor: pointer;
}
.photo-modal img {
  max-width: 90vw; max-height: 80vh;
  border-radius: 12px; object-fit: contain;
}
.modal-close { color: white; font-size: 14px; opacity: 0.7; }

/* View toggle */
.view-toggle {
  position: fixed; bottom: 20px; right: 20px;
}
.view-toggle button {
  padding: 10px 16px;
  background: white; border: 1.5px solid #ddd;
  border-radius: 20px; font-size: 13px;
  cursor: pointer; font-family: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.view-toggle button:hover { border-color: #6B3FA0; color: #6B3FA0; }

@media (max-width: 480px) {
  .field-row-2 { grid-template-columns: 1fr; }
  .stat-cards { grid-template-columns: repeat(3, 1fr); }
  .filters { flex-direction: column; }
}
