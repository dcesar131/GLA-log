import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { CLASSROOMS, LOCATIONS, SCHEDULES } from './schedules';
import './App.css';

type View = 'teacher' | 'admin';
type Submission = {
  id: string;
  created_at: string;
  classroom: string;
  location: string;
  activity: string;
  teacher_name: string;
  note: string;
  photo_url: string | null;
};

function getCurrentActivity(classroom: string): string {
  const schedule = SCHEDULES[classroom] || [];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  function parseTime(t: string): number {
    const cleaned = t.trim().replace('–', '-');
    const [start] = cleaned.split('-');
    const match = start.trim().match(/(\d+):(\d+)/);
    if (!match) return 0;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    if (h < 7) h += 12;
    return h * 60 + m;
  }

  for (let i = 0; i < schedule.length; i++) {
    const start = parseTime(schedule[i].time);
    const end = i + 1 < schedule.length ? parseTime(schedule[i + 1].time) : start + 30;
    if (currentMinutes >= start && currentMinutes < end) {
      return schedule[i].activity;
    }
  }
  return '';
}

// ──────────────────────────────────────────────
// TEACHER SUBMISSION FORM
// ──────────────────────────────────────────────
function TeacherForm() {
  const [classroom, setClassroom] = useState('');
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (classroom) {
      const auto = getCurrentActivity(classroom);
      if (auto) setActivity(auto);
    }
  }, [classroom]);

  const handlePhoto = (file: File) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!classroom || !location || !activity || !teacherName) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    let photo_url: string | null = null;

    if (photo) {
      const ext = photo.name.split('.').pop();
      const filename = `${Date.now()}-${classroom.replace(/\s/g, '_')}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('activity-photos')
        .upload(filename, photo, { contentType: photo.type });

      if (uploadError) {
        setError('Photo upload failed: ' + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('activity-photos')
        .getPublicUrl(filename);
      photo_url = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('activity_logs').insert([{
      classroom,
      location,
      activity,
      teacher_name: teacherName,
      note,
      photo_url,
    }]);

    if (insertError) {
      setError('Submission failed: ' + insertError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const reset = () => {
    setClassroom(''); setLocation(''); setActivity('');
    setTeacherName(''); setNote(''); setPhoto(null);
    setPhotoPreview(null); setSubmitted(false); setError('');
  };

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-icon">✓</div>
        <h2>Check-in submitted!</h2>
        <p>{classroom} · {location}</p>
        <p className="activity-confirm">{activity}</p>
        <button className="btn-primary" onClick={reset}>Submit Another</button>
      </div>
    );
  }

  const scheduleList = SCHEDULES[classroom] || [];

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="gla-badge">GLA</div>
        <div>
          <h1>Activity Check-In</h1>
          <p>Giselle Learning Academy</p>
        </div>
      </div>

      <div className="form-body">
        <div className="field-group">
          <label>Your Name *</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={teacherName}
            onChange={e => setTeacherName(e.target.value)}
          />
        </div>

        <div className="field-row-2">
          <div className="field-group">
            <label>Location *</label>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="">Select...</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>Classroom *</label>
            <select value={classroom} onChange={e => setClassroom(e.target.value)}>
              <option value="">Select...</option>
              {CLASSROOMS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="field-group">
          <label>Current Activity *</label>
          <select value={activity} onChange={e => setActivity(e.target.value)}>
            <option value="">Select activity...</option>
            {scheduleList.map(s => (
              <option key={s.activity} value={s.activity}>
                {s.time} — {s.activity}
              </option>
            ))}
          </select>
          {activity && <div className="activity-chip">{activity}</div>}
        </div>

        <div className="field-group">
          <label>Photo <span className="optional">(optional)</span></label>
          <div className="photo-area">
            {photoPreview ? (
              <div className="photo-preview">
                <img src={photoPreview} alt="preview" />
                <button className="remove-photo" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>✕ Remove</button>
              </div>
            ) : (
              <div className="photo-buttons">
                <button className="photo-btn" onClick={() => cameraRef.current?.click()}>
                  📷 Take Photo
                </button>
                <button className="photo-btn" onClick={() => fileRef.current?.click()}>
                  🖼 Choose File
                </button>
              </div>
            )}
            <input ref={cameraRef} type="file" accept="image/*" capture="environment"
              style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
          </div>
        </div>

        <div className="field-group">
          <label>Note <span className="optional">(optional)</span></label>
          <textarea
            placeholder="Any notes about the activity..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Check-In'}
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// ADMIN DASHBOARD
// ──────────────────────────────────────────────
function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterClassroom, setFilterClassroom] = useState('All');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterDate) {
      query = query.gte('created_at', filterDate + 'T00:00:00')
                   .lte('created_at', filterDate + 'T23:59:59');
    }
    if (filterLocation !== 'All') query = query.eq('location', filterLocation);
    if (filterClassroom !== 'All') query = query.eq('classroom', filterClassroom);

    const { data, error } = await query.limit(200);
    if (!error && data) setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filterLocation, filterClassroom, filterDate]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const groupedByClassroom = CLASSROOMS.reduce((acc, c) => {
    acc[c] = submissions.filter(s => s.classroom === c);
    return acc;
  }, {} as Record<string, Submission[]>);

  const totalToday = submissions.length;
  const withPhotos = submissions.filter(s => s.photo_url).length;
  const activeClassrooms = Object.values(groupedByClassroom).filter(arr => arr.length > 0).length;

  return (
    <div className="admin-container">
      {expandedPhoto && (
        <div className="photo-modal" onClick={() => setExpandedPhoto(null)}>
          <img src={expandedPhoto} alt="full size" />
          <div className="modal-close">✕ Close</div>
        </div>
      )}

      <div className="admin-header">
        <div>
          <h1>GLA Activity Dashboard</h1>
          <p>Giselle Learning Academy — Staff Activity Log</p>
        </div>
        <button className="btn-refresh" onClick={fetchData}>↻ Refresh</button>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-num">{totalToday}</div>
          <div className="stat-label">Check-ins Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{activeClassrooms}</div>
          <div className="stat-label">Active Classrooms</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{withPhotos}</div>
          <div className="stat-label">With Photos</div>
        </div>
      </div>

      <div className="filters">
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
          <option value="All">All Locations</option>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={filterClassroom} onChange={e => setFilterClassroom(e.target.value)}>
          <option value="All">All Classrooms</option>
          {CLASSROOMS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="empty-state">No check-ins found for selected filters.</div>
      ) : (
        <div className="classroom-sections">
          {CLASSROOMS.map(cls => {
            const logs = groupedByClassroom[cls];
            if (logs.length === 0) return null;
            return (
              <div key={cls} className="classroom-section">
                <div className="classroom-header">
                  <span className="classroom-name">{cls}</span>
                  <span className="classroom-count">{logs.length} check-in{logs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="log-entries">
                  {logs.map(log => (
                    <div key={log.id} className="log-entry">
                      <div className="log-time">{formatTime(log.created_at)}</div>
                      <div className="log-main">
                        <div className="log-activity">{log.activity}</div>
                        <div className="log-meta">
                          <span>{log.teacher_name}</span>
                          <span className="dot">·</span>
                          <span>{log.location}</span>
                          {log.note && <><span className="dot">·</span><span className="log-note">"{log.note}"</span></>}
                        </div>
                      </div>
                      {log.photo_url && (
                        <img
                          className="log-thumb"
                          src={log.photo_url}
                          alt="activity"
                          onClick={() => setExpandedPhoto(log.photo_url)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────
export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get('admin') === 'true';
  const [view, setView] = useState<View>(isAdmin ? 'admin' : 'teacher');

  return (
    <div className="app">
      {view === 'teacher' ? <TeacherForm /> : <AdminDashboard />}
      <div className="view-toggle">
        <button onClick={() => setView(view === 'teacher' ? 'admin' : 'teacher')}>
          {view === 'teacher' ? '⚙ Admin View' : '← Teacher View'}
        </button>
      </div>
    </div>
  );
}
