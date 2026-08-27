'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Trash2,
  Eye,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  PlusCircle,
  X,
  UploadCloud,
  Clock,
  Images,
  FolderSync
} from 'lucide-react';
import { DEFAULT_WINGS } from '../../types/events';
import { countWords } from '../../lib/googleDrive';
import { compressImageInBrowser } from '../../lib/imageCompressor';
import styles from './AdminEventUploader.module.css';

// Exactly 6 Domain / Wing Options
export const DOMAIN_OPTIONS = [
  { id: 'general-church', label: 'General Church', envKey: 'DRIVE_FOLDER_GENERAL_CHURCH' },
  { id: 'ce-union', label: 'CE Union', envKey: 'DRIVE_FOLDER_CE_UNION' },
  { id: 'mahila-samiti', label: 'Mahila Samiti', envKey: 'DRIVE_FOLDER_MAHILA_SAMITI' },
  { id: 'sunday-school', label: 'Sunday School', envKey: 'DRIVE_FOLDER_SUNDAY_SCHOOL' },
  { id: 'youth-fellowship', label: 'Youth Fellowship', envKey: 'DRIVE_FOLDER_YOUTH_FELLOWSHIP' },
  { id: 'elders-fellowship', label: 'Elders Fellowship', envKey: 'DRIVE_FOLDER_ELDERS_FELLOWSHIP' },
];

export default function AdminEventUploader({
  initialWingId,
  wings = DEFAULT_WINGS,
  onEventCreated,
  onEventDeleted,
}) {
  // Tabs: 'upload' | 'manage'
  const [activeTab, setActiveTab] = useState('upload');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(
    initialWingId && DOMAIN_OPTIONS.some((d) => d.id === initialWingId)
      ? initialWingId
      : ''
  );
  const [eventDate, setEventDate] = useState('');
  const [location] = useState('Church Campus, Union Church Bhubaneswar');
  const [authorName] = useState('Church Administrator');
  const [description, setDescription] = useState('');

  // Image Upload & Staging State (Max 20 images)
  const [stagedImages, setStagedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Events List for Manage Tab
  const [eventsList, setEventsList] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [manageFilterWing, setManageFilterWing] = useState('all');
  const [manageSearch, setManageSearch] = useState('');

  // Live Word Count
  const currentWordCount = useMemo(() => countWords(description), [description]);
  const maxWords = 1000;
  const isOverWordLimit = currentWordCount > maxWords;
  const wordPercentage = Math.min(100, Math.round((currentWordCount / maxWords) * 100));

  // Determine active selected domain / wing object
  const activeWing = useMemo(() => {
    const selectedDomain = DOMAIN_OPTIONS.find((d) => d.id === category);
    const matchedWing = wings.find(
      (w) => w.id === category || (category === 'mahila-samiti' && w.id === 'womens-fellowship')
    );
    return matchedWing || {
      id: selectedDomain?.id || 'general-church',
      name: selectedDomain?.label || 'General Church',
      accentColor: '#800000',
      bgGlow: 'rgba(128, 0, 0, 0.08)',
    };
  }, [wings, category]);

  // Load existing events for Manage Tab
  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/events.php`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEventsList(data.data);
      }
    } catch (err) {
      console.warn('[AdminEventUploader] Error fetching events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // Upload staged images to Google Drive via backend
  const handleUploadImages = useCallback(async () => {
    if (stagedImages.length === 0) {
      setToast({ type: 'error', message: 'No images staged. Please select images first.' });
      return;
    }
    if (!category) {
      setToast({ type: 'error', message: 'Please select a Domain / Wing before uploading images.' });
      return;
    }

    setIsUploadingImages(true);
    setUploadStatus('uploading');
    setToast(null);

    try {
      const formData = new FormData();
      formData.append('domain', category);

      for (let i = 0; i < stagedImages.length; i++) {
        try {
          const compressed = await compressImageInBrowser(stagedImages[i].file, 1200, 0.75);
          formData.append('images[]', compressed);
        } catch {
          formData.append('images[]', stagedImages[i].file);
        }
      }

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/drive-upload.php`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.urls)) {
        setUploadedImageUrls(data.urls);
        setUploadStatus('uploaded');
        setToast({
          type: 'success',
          message: `${data.urls.length} image(s) uploaded to Google Drive successfully!`,
        });
      } else {
        throw new Error(data.error || 'Upload failed with no URLs returned.');
      }
    } catch (err) {
      console.warn('[AdminEventUploader] Image upload error:', err);
      setUploadStatus('error');
      setToast({
        type: 'error',
        message: `Image upload failed: ${err.message}. You can still submit the event — images will be attached directly.`,
      });
    } finally {
      setIsUploadingImages(false);
    }
  }, [stagedImages, category]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      stagedImages.forEach((item) => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [stagedImages]);

  // Handle File Selection (Max 20 Images Validation)
  const processFiles = (incomingFiles) => {
    const fileArray = Array.from(incomingFiles).filter((f) => f.type.startsWith('image/'));

    if (fileArray.length === 0) {
      setToast({ type: 'error', message: 'Please select valid image files (JPEG, PNG, WEBP, etc.).' });
      return;
    }

    const currentCount = stagedImages.length;
    const availableSlots = 20 - currentCount;

    if (availableSlots <= 0) {
      setToast({ type: 'error', message: 'Maximum limit of 20 images reached' });
      return;
    }

    let filesToAdd = fileArray;
    if (fileArray.length > availableSlots) {
      filesToAdd = fileArray.slice(0, availableSlots);
      setToast({
        type: 'error',
        message: `Maximum limit of 20 images reached. Only added ${availableSlots} image(s).`,
      });
    } else {
      setToast(null);
    }

    const newStagedItems = filesToAdd.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setStagedImages((prev) => [...prev, ...newStagedItems]);
    setUploadStatus('staged');
    setUploadedImageUrls([]);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Remove Individual Thumbnail
  const handleRemoveThumbnail = (id) => {
    setStagedImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target && target.previewUrl && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        setUploadStatus('idle');
        setUploadedImageUrls([]);
      } else if (uploadStatus === 'uploaded') {
        setUploadStatus('staged');
        setUploadedImageUrls([]);
      }
      return updated;
    });
  };


  // Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Clear / Reset Form
  const handleReset = () => {
    setTitle('');
    setEventDate('');
    setCategory('');
    setDescription('');
    stagedImages.forEach((item) => {
      if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setStagedImages([]);
    setUploadedImageUrls([]);
    setUploadStatus('idle');
    setToast(null);
  };

  // Form Submit Handler ("Add Event")
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !eventDate || !category || !description.trim()) {
      setToast({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    if (isOverWordLimit) {
      setToast({
        type: 'error',
        message: `Description exceeds the 1000-word limit. Please shorten your text.`,
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const domainOption = DOMAIN_OPTIONS.find((d) => d.id === category);
      const domainName = domainOption ? domainOption.label : category;

      // 1. Create FormData
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('date', eventDate);
      formData.append('eventDate', eventDate);
      formData.append('domain', category);
      formData.append('wingId', category);
      formData.append('wingName', domainName);
      formData.append('description', description.trim());
      formData.append('location', location);
      formData.append('authorName', authorName);

      // 2. Compress images sequentially and append
      if (stagedImages.length > 0) {
        for (let i = 0; i < stagedImages.length; i++) {
          const item = stagedImages[i];
          try {
            const compressedFile = await compressImageInBrowser(item.file, 1200, 0.7);
            formData.append('images[]', compressedFile);
          } catch (compressErr) {
            console.error('Image compression failed for', item.name, compressErr);
            // Fallback to uncompressed if compression fails
            formData.append('images[]', item.file);
          }
        }
      }

      // 3. Post to PHP Backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/events.php`, {
        method: 'POST',
        body: formData, // fetch will automatically set the correct multipart boundary
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setToast({
          type: 'success',
          message: `Event "${title.trim()}" published & saved under ${domainName} successfully!`,
        });
        handleReset();
        fetchEvents();
        if (onEventCreated && result.data) {
          onEventCreated(result.data);
        }
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Failed to add event.',
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
  const handleDeleteEvent = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete event "${eventTitle}"?`)) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/events.php?id=${id}`, {
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
    const matchesWing = manageFilterWing === 'all' || e.wingId?.toLowerCase() === manageFilterWing.toLowerCase();
    if (!matchesWing) return false;
    if (!manageSearch.trim()) return true;
    const q = manageSearch.toLowerCase().trim();
    return e.title.toLowerCase().includes(q) || (e.wingName && e.wingName.toLowerCase().includes(q));
  });

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.headerTitleWrapper}>
          <div className={styles.headerBadge}>
            <FolderSync size={13} />
            <span>Google Drive Event Portal</span>
          </div>
          <h2 className={styles.adminTitle}>Events & Wing Management Portal</h2>
          <p className={styles.adminSubtitle}>
            Publish church events with Google Drive subfolder integration, 20-image staging, and dynamic wing association.
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
      {/* TAB 1: UPLOAD & GOOGLE DRIVE STAGING FORM                 */}
      {/* ========================================================= */}
      {activeTab === 'upload' && (
        <div className={styles.formGrid}>
          {/* Left Column: Form Fields */}
          <div className={styles.formCard}>
            <h3 className={styles.formCardTitle}>Upload New Wing Event</h3>
            <p className={styles.formCardDesc}>
              Fill in all event fields and attach up to 20 images to upload into Google Drive.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Event Title */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span>Title <span className={styles.requiredStar}>*</span></span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {title.length}/100 chars
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.textInput}
                  required
                />
              </div>

              {/* Date & Domain Dropdown */}
              <div className={styles.rowInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <span>Date <span className={styles.requiredStar}>*</span></span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <span>Domain / Wing Dropdown <span className={styles.requiredStar}>*</span></span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.selectInput}
                    required
                  >
                    <option value="" disabled>Choose domain / wing</option>
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <span>Description <span className={styles.requiredStar}>*</span></span>

                  {/* Word Counter Indicator */}
                  {description.trim() && (
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
                  )}
                </div>

                <textarea
                  rows={4}
                  placeholder="Enter event description..."
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
                    ⚠️ Description is {currentWordCount - maxWords} words over the 1000-word limit. Please shorten.
                  </p>
                )}
              </div>

              {/* Image Upload & Google Drive Staging Section */}
              <div className={styles.inputGroup}>
                <div className={styles.inputLabel}>
                  <span>Google Drive Image Staging <span style={{ fontWeight: 'normal', color: '#64748b', fontSize: '0.8rem' }}>(Max 20 Images)</span></span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {stagedImages.length} / 20 Selected
                  </span>
                </div>

                <div className={styles.imageUploadSection}>
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />

                  {/* Dropzone Trigger */}
                  <div
                    className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={styles.dropzoneIconWrapper}>
                      <UploadCloud size={28} />
                    </div>
                    <div className={styles.dropzoneTitle}>
                      {stagedImages.length === 0 ? 'Click to select or drag & drop images here' : 'Add more images'}
                    </div>
                    <div className={styles.dropzoneSub}>
                      PNG, JPG, JPEG, WEBP, GIF (Max 20 photos total)
                    </div>
                    <button
                      type="button"
                      className={styles.dropzoneBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <PlusCircle size={15} />
                      <span>Add Images</span>
                    </button>
                  </div>

                  {/* Staged Images Header & Controls */}
                  {stagedImages.length > 0 && (
                    <>
                      <div className={styles.stagedHeaderRow}>
                        <div className={styles.stagedCountInfo}>
                          <Images size={18} color="#0284c7" />
                          <span>Staged Images ({stagedImages.length})</span>

                          {/* Visual Status Badges */}
                          {uploadStatus === 'staged' && (
                            <span className={`${styles.uploadStatusBadge} ${styles.staged}`}>
                              <Clock size={12} />
                              <span>Ready to upload</span>
                            </span>
                          )}

                          {uploadStatus === 'uploading' && (
                            <span className={`${styles.uploadStatusBadge} ${styles.uploading}`}>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>Uploading to Google Drive...</span>
                            </span>
                          )}

                          {uploadStatus === 'uploaded' && (
                            <span className={`${styles.uploadStatusBadge} ${styles.uploaded}`}>
                              <CheckCircle size={12} />
                              <span>Uploaded to Drive ✓</span>
                            </span>
                          )}

                          {uploadStatus === 'error' && (
                            <span className={`${styles.uploadStatusBadge} ${styles.error}`}>
                              <AlertCircle size={12} />
                              <span>Upload Failed</span>
                            </span>
                          )}
                        </div>

                        {/* Upload Images Action Button */}
                        <button
                          type="button"
                          onClick={handleUploadImages}
                          disabled={isUploadingImages || uploadStatus === 'uploaded' || !category}
                          className={styles.uploadActionBtn}
                          title={!category ? 'Select a domain above first' : 'Upload to Google Drive'}
                        >
                          {isUploadingImages ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : uploadStatus === 'uploaded' ? (
                            <>
                              <CheckCircle size={14} />
                              <span>Uploaded to Drive</span>
                            </>
                          ) : (
                            <>
                              <Upload size={14} />
                              <span>Upload Images ({stagedImages.length})</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Staged Thumbnails Preview Grid */}
                      <div className={styles.stagedThumbnailsGrid}>
                        {stagedImages.map((item, idx) => (
                          <div key={item.id} className={styles.stagedThumbCard}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className={styles.stagedThumbImg}
                            />
                            {/* Number Badge */}
                            <span className={styles.thumbNumberBadge}>#{idx + 1}</span>

                            {/* Remove (❌) Action Button */}
                            <button
                              type="button"
                              className={styles.removeThumbBtn}
                              onClick={() => handleRemoveThumbnail(item.id)}
                              title="Remove image"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={isSubmitting || isOverWordLimit || !title.trim() || !eventDate || !category || !description.trim()}
                  className={styles.submitBtn}
                  style={{ margin: 0, flex: 2, minWidth: '200px' }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Publishing Event...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      <span>Add Event</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.resetBtn}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Event Card Preview */}
          <div className={styles.previewColumn}>
            <div className={styles.previewStickyCard}>
              <div className={styles.previewHeaderTag}>
                <span className={styles.previewBadge}>Live Domain Card Preview</span>
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
                {/* Cover Image Preview if images exist */}
                {stagedImages.length > 0 && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      background: '#f1f5f9',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stagedImages[0].previewUrl}
                      alt="Cover Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ImageIcon size={12} />
                      <span>📸 {stagedImages.length} Photo{stagedImages.length === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                )}

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
                    {eventDate || 'YYYY-MM-DD'}
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
                    Google Drive Photos ({stagedImages.length} Staged)
                  </span>

                  {stagedImages.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                      {stagedImages.slice(0, 4).map((item, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={item.previewUrl}
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
                      Add images to stage Google Drive upload
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
                style={{ width: '200px', padding: '0.45rem 0.75rem' }}
              >
                <option value="all">All Domains ({eventsList.length})</option>
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchEvents}
              disabled={isLoadingEvents}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} className={isLoadingEvents ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Table Content */}
          {isLoadingEvents ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <RefreshCw size={32} className="animate-spin" color="#800000" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading existing events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <FileText size={40} style={{ margin: '0 auto 0.5rem auto' }} />
              <p>No events found matching your criteria.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.eventsTable}>
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Domain</th>
                    <th>Event Date</th>
                    <th>Photos</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((evt) => (
                    <tr key={evt.id}>
                      <td style={{ width: '60px' }}>
                        {evt.coverImage || (evt.images && evt.images[0]) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={evt.coverImage || evt.images[0]}
                            alt=""
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              background: '#f1f5f9',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ImageIcon size={18} color="#94a3b8" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{evt.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {evt.description}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '20px',
                            background: 'rgba(128,0,0,0.08)',
                            color: '#800000',
                          }}
                        >
                          {evt.wingName}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {evt.eventDate || 'N/A'}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#0284c7',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <ImageIcon size={13} />
                          {evt.images?.length || 0}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          className={styles.deleteActionBtn}
                          title="Delete event"
                          aria-label={`Delete ${evt.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
