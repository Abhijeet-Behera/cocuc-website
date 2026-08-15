'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FolderOpen,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Trash2,
  Eye,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  PlusCircle,
  Clock
} from 'lucide-react';
import { Wing, EventItem, DEFAULT_WINGS } from '../../types/events';
import { extractFolderId, countWords } from '../../lib/googleDrive';
import styles from './AdminEventUploader.module.css';

interface AdminEventUploaderProps {
  initialWingId?: string;
  wings?: Wing[];
  onEventCreated?: (newEvent: EventItem) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function AdminEventUploader({
  initialWingId,
  wings = DEFAULT_WINGS,
  onEventCreated,
  onEventDeleted,
}: AdminEventUploaderProps) {
  // Tabs: 'upload' | 'manage'
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

  // Form State
  const [title, setTitle] = useState('');
  const [selectedWingId, setSelectedWingId] = useState(initialWingId || wings[0]?.id || 'youth-wing');
  const [customWingName, setCustomWingName] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Church Campus, Union Church Bhubaneswar');
  const [authorName, setAuthorName] = useState('Church Administrator');
  const [description, setDescription] = useState('');
  const [folderUrl, setFolderUrl] = useState('');

  // Extracted Images State
  const [extractedFolderId, setExtractedFolderId] = useState<string | null>(null);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [extractMessage, setExtractMessage] = useState('');

  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Events List for Manage Tab
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [manageFilterWing, setManageFilterWing] = useState<string>('all');
  const [manageSearch, setManageSearch] = useState<string>('');

  // Live Word Count & 1000-Word Constraint
  const currentWordCount = useMemo(() => countWords(description), [description]);
  const maxWords = 1000;
  const isOverWordLimit = currentWordCount > maxWords;
  const wordPercentage = Math.min(100, Math.round((currentWordCount / maxWords) * 100));

  // Determine active selected wing object
  const activeWing = useMemo(() => {
    return wings.find((w) => w.id === selectedWingId) || wings[0];
  }, [wings, selectedWingId]);

  // Load existing events for Manage Tab
  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEventsList(data.data);
      }
    } catch (err) {
      console.error('[AdminEventUploader] Error fetching events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Auto-parse Google Drive link and fetch images
  const handleDriveUrlChange = async (url: string) => {
    setFolderUrl(url);
    const folderId = extractFolderId(url);
    setExtractedFolderId(folderId);

    if (!folderId) {
      setExtractedImages([]);
      setExtractStatus('idle');
      setExtractMessage('');
      return;
    }

    setIsExtracting(true);
    setExtractStatus('loading');
    setExtractMessage('Parsing folder & querying Google Drive API...');

    try {
      const res = await fetch('/api/fetch-drive-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderUrl: url,
          wingHint: selectedWingId,
        }),
      });

      const data = await res.json();
      if (data.success && data.images && data.images.length > 0) {
        setExtractedImages(data.images);
        setExtractStatus('success');
        setExtractMessage(`Successfully retrieved ${data.count} image${data.count === 1 ? '' : 's'}.`);
      } else {
        setExtractStatus('error');
        setExtractMessage(data.error || 'Could not fetch images from folder.');
      }
    } catch (err) {
      setExtractStatus('error');
      setExtractMessage('Network error while connecting to Google Drive API.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setToast({ type: 'error', message: 'Please provide an Event Title.' });
      return;
    }

    if (!description.trim()) {
      setToast({ type: 'error', message: 'Please provide an Event Description.' });
      return;
    }

    if (isOverWordLimit) {
      setToast({
        type: 'error',
        message: `Description exceeds the 1000-word limit (${currentWordCount}/1000 words). Please shorten your text.`,
      });
      return;
    }

    if (!folderUrl.trim() || !extractedFolderId) {
      setToast({
        type: 'error',
        message: 'Please provide a valid Google Drive folder link.',
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    const payload = {
      title: title.trim(),
      wingId: selectedWingId === 'custom' ? customWingName.toLowerCase().replace(/\s+/g, '-') : selectedWingId,
      wingName: selectedWingId === 'custom' ? customWingName : activeWing?.name || selectedWingId,
      description: description.trim(),
      folderUrl: folderUrl.trim(),
      folderId: extractedFolderId,
      images: extractedImages,
      coverImage: extractedImages[0],
      eventDate,
      location,
      authorName,
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setToast({
          type: 'success',
          message: `Event "${payload.title}" created & mapped to ${payload.wingName} successfully!`,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setFolderUrl('');
        setExtractedImages([]);
        setExtractedFolderId(null);
        setExtractStatus('idle');

        // Refresh list
        fetchEvents();
        if (onEventCreated && result.data) {
          onEventCreated(result.data);
        }
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Failed to upload event.',
        });
      }
    } catch (err) {
      console.error('[AdminEventUploader] Submit error:', err);
      setToast({ type: 'error', message: 'Network error while submitting event.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Event Handler
  const handleDeleteEvent = async (id: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${eventTitle}"?`)) return;

    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: `Event "${eventTitle}" deleted successfully.` });
        setEventsList((prev) => prev.filter((e) => e.id !== id));
        if (onEventDeleted) {
          onEventDeleted(id);
        }
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to delete event.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error deleting event.' });
    }
  };

  // Filtered list for manage tab
  const filteredEvents = eventsList.filter((e) => {
    const matchesWing = manageFilterWing === 'all' || e.wingId.toLowerCase() === manageFilterWing.toLowerCase();
    if (!matchesWing) return false;
    if (!manageSearch.trim()) return true;
    const q = manageSearch.toLowerCase().trim();
    return e.title.toLowerCase().includes(q) || e.wingName.toLowerCase().includes(q);
  });

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.headerTitleWrapper}>
          <div className={styles.headerBadge}>
            <Sparkles size={13} />
            <span>Church Events Engine</span>
          </div>
          <h2 className={styles.adminTitle}>Events & Wing Management Portal</h2>
          <p className={styles.adminSubtitle}>
            Upload event announcements, associate with ministry wings, enforce 1000-word descriptions,
            and auto-extract Google Drive photo galleries.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={16} />
            <span>Upload New Event</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'manage' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            <Layers size={16} />
            <span>Manage Events ({eventsList.length})</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className={`${styles.toastMessage} ${styles[toast.type]}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: UPLOAD & LIVE ASSOCIATION FORM                    */}
      {/* ========================================================= */}
      {activeTab === 'upload' && (
        <div className={styles.formGrid}>
          {/* Left Column: Form Fields */}
          <div className={styles.formCard}>
            <h3 className={styles.formCardTitle}>Upload New Wing Event</h3>
            <p className={styles.formCardDesc}>
              Fill in the event information and provide the public Google Drive folder URL.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Event Title */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Event Title <span className={styles.requiredStar}>*</span></span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {title.length}/100 chars
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. IGNITE: Annual Youth Winter Retreat 2025"
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.textInput}
                  required
                />
              </div>

              {/* Target Wing Selector */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Target Wing Association <span className={styles.requiredStar}>*</span></span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Maps directly to Bus Topology
                  </span>
                </label>
                <select
                  value={selectedWingId}
                  onChange={(e) => setSelectedWingId(e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  {wings.map((wing) => (
                    <option key={wing.id} value={wing.id}>
                      {wing.name} ({wing.tagline.substring(0, 45)}...)
                    </option>
                  ))}
                  <option value="custom">+ Add Custom Ministry Wing...</option>
                </select>
              </div>

              {/* Custom Wing Name input (if chosen) */}
              {selectedWingId === 'custom' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <span>Custom Wing Name <span className={styles.requiredStar}>*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Citizens Fellowship"
                    value={customWingName}
                    onChange={(e) => setCustomWingName(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>
              )}

              {/* Date & Location */}
              <div className={styles.rowInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <span>Event Date</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <span>Venue / Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Sanctuary"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>

              {/* Description & Real-time Live Word Counter */}
              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <span>Full Event Description <span className={styles.requiredStar}>*</span></span>

                  {/* Word Counter Indicator */}
                  <div className={styles.wordCounterWrapper}>
                    <div
                      className={`${styles.wordCountPill} ${
                        isOverWordLimit
                          ? styles.danger
                          : currentWordCount > 900
                          ? styles.warning
                          : styles.safe
                      }`}
                    >
                      <FileText size={12} />
                      <span>
                        {currentWordCount} / {maxWords} words
                      </span>
                    </div>

                    <div className={styles.wordProgressBar}>
                      <div
                        className={styles.wordProgressFill}
                        style={{
                          width: `${wordPercentage}%`,
                          backgroundColor: isOverWordLimit
                            ? '#ef4444'
                            : currentWordCount > 900
                            ? '#f59e0b'
                            : '#0ea5e9',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <textarea
                  rows={7}
                  placeholder="Write full event details, sermon notes, keynote speakers, highlights, and testimonies (supports up to 1000 words)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textareaInput}
                  style={{
                    borderColor: isOverWordLimit ? '#ef4444' : undefined,
                  }}
                  required
                />

                {isOverWordLimit && (
                  <p style={{ fontSize: '0.82rem', color: '#ef4444', marginTop: '0.25rem', fontWeight: 600 }}>
                    ⚠️ Description is {currentWordCount - maxWords} words over the 1000-word limit. Please shorten to proceed.
                  </p>
                )}
              </div>

              {/* Google Drive Public Folder URL */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Google Drive Public Folder URL <span className={styles.requiredStar}>*</span></span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Auto-extracts photo gallery
                  </span>
                </label>

                <div className={styles.driveInputWrapper}>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/1ABC_xyz-12345?usp=sharing"
                    value={folderUrl}
                    onChange={(e) => handleDriveUrlChange(e.target.value)}
                    className={styles.textInput}
                    style={{ paddingRight: '9rem' }}
                    required
                  />

                  {extractStatus !== 'idle' && (
                    <div
                      className={`${styles.driveStatusBadge} ${styles[extractStatus]}`}
                    >
                      {extractStatus === 'loading' && <RefreshCw size={12} className="animate-spin" />}
                      {extractStatus === 'success' && <CheckCircle size={12} />}
                      {extractStatus === 'error' && <AlertCircle size={12} />}
                      <span>
                        {extractStatus === 'loading'
                          ? 'Parsing...'
                          : extractStatus === 'success'
                          ? `${extractedImages.length} Photos`
                          : 'Invalid URL'}
                      </span>
                    </div>
                  )}
                </div>

                {extractedFolderId && (
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Parsed Folder ID: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{extractedFolderId}</code>
                  </p>
                )}
              </div>

              {/* Extracted Photos Preview Grid */}
              {extractedImages.length > 0 && (
                <div className={styles.extractedPhotosCard}>
                  <div className={styles.extractedHeader}>
                    <span>Dynamic Photos Extracted ({extractedImages.length})</span>
                    <span style={{ color: '#15803d', fontSize: '0.78rem' }}>✓ Ready to attach</span>
                  </div>
                  <div className={styles.extractedGrid}>
                    {extractedImages.slice(0, 8).map((imgUrl, i) => (
                      <div key={i} className={styles.previewThumb}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt={`Extracted ${i + 1}`} className={styles.previewImg} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isOverWordLimit || !title.trim() || !description.trim()}
                className={styles.submitBtn}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Publishing & Mapping to Wing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Publish Event to {activeWing?.name || 'Wing'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Event Card Preview */}
          <div className={styles.previewColumn}>
            <div className={styles.previewStickyCard}>
              <div className={styles.previewHeaderTag}>
                <span className={styles.previewBadge}>Live Wing Card Preview</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Target: <strong>{activeWing?.name}</strong>
                </span>
              </div>

              {/* Preview Card Mock */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      background: activeWing?.bgGlow || 'rgba(128,0,0,0.1)',
                      color: activeWing?.accentColor || '#800000',
                      fontWeight: 700,
                    }}
                  >
                    {activeWing?.name}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Calendar size={11} />
                    {eventDate}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {title || 'Your Event Title Will Appear Here'}
                </h4>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#475569',
                    lineHeight: 1.55,
                    marginBottom: '0.85rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {description || 'Event description and details will render here with full expandable formatting up to 1000 words.'}
                </p>

                {/* Preview Gallery */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                    <ImageIcon size={12} color={activeWing?.accentColor} />
                    Drive Gallery ({extractedImages.length > 0 ? extractedImages.length : 0} Images)
                  </span>

                  {extractedImages.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                      {extractedImages.slice(0, 4).map((url, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={url}
                          alt="Preview"
                          style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px dashed #cbd5e1',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                      }}
                    >
                      Paste a Google Drive folder link to preview parsed photos
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MANAGE & DELETE EXISTING EVENTS                   */}
      {/* ========================================================= */}
      {activeTab === 'manage' && (
        <div className={styles.eventsListCard}>
          {/* Table Toolbar */}
          <div className={styles.tableToolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  className={styles.textInput}
                  style={{ paddingLeft: '2rem', width: '220px', padding: '0.45rem 0.75rem 0.45rem 2rem' }}
                />
              </div>

              {/* Wing Filter */}
              <select
                value={manageFilterWing}
                onChange={(e) => setManageFilterWing(e.target.value)}
                className={styles.selectInput}
                style={{ width: '180px', padding: '0.45rem 0.75rem' }}
              >
                <option value="all">All Wings ({eventsList.length})</option>
                {wings.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveTab('upload')}
              className="btn-primary"
              style={{
                fontSize: '0.85rem',
                padding: '0.5rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '30px',
                textTransform: 'none',
              }}
            >
              <PlusCircle size={15} />
              <span>New Event</span>
            </button>
          </div>

          {/* Table */}
          {isLoadingEvents ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto', color: '#800000' }} />
              <p style={{ marginTop: '0.75rem', color: '#64748b' }}>Loading uploaded events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <FolderOpen size={40} style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>No events found matching your criteria.</p>
            </div>
          ) : (
            <table className={styles.eventsTable}>
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Wing</th>
                  <th>Date</th>
                  <th>Photos</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <strong>{evt.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        {evt.location || 'Church Campus'}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(128,0,0,0.08)',
                          color: '#800000',
                        }}
                      >
                        {evt.wingName}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {evt.eventDate || evt.createdAt?.split('T')[0]}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ImageIcon size={13} color="#2563eb" />
                        {evt.images?.length || 0} Photos
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={`/events/${evt.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.tableActionBtn}
                          title="View Event Page"
                        >
                          <Eye size={13} />
                          <span>View Page</span>
                        </a>
                        <button
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          className={`${styles.tableActionBtn} ${styles.delete}`}
                          title="Delete this event"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
