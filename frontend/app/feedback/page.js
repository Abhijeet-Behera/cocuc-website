'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertCircle, X, Image as ImageIcon, Video, Star } from 'lucide-react';
import styles from './FeedbackForm.module.css';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [facedIssue, setFacedIssue] = useState(null); // 'yes' or 'no'
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  
  const [images, setImages] = useState([]); // File objects
  const [video, setVideo] = useState(null); // File object
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [previewFile, setPreviewFile] = useState(null);
  const [mounted, setMounted] = useState(false);

  const imagesInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [clientIp, setClientIp] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // Check feedback limit on mount
    const checkLimit = async () => {
      try {
        // 1. Get client IP
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const currentIp = ipData.ip;
        setClientIp(currentIp);

        // 2. Check limit with Google Apps Script
        const scriptUrl = process.env.NEXT_PUBLIC_FEEDBACK_SCRIPT_URL;
        if (!scriptUrl || scriptUrl === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
          return; // Skip check if script not configured
        }

        const checkUrl = `${scriptUrl}?action=check&ip=${encodeURIComponent(currentIp)}`;
        const res = await fetch(checkUrl);
        const data = await res.json();
        
        if (data.allowed === false) {
          setIsBlocked(true);
        }
      } catch (err) {
        console.error('Failed to check limit:', err);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkLimit();
  }, []);

  const openPreview = (file, type) => {
    const url = URL.createObjectURL(file);
    setPreviewFile({ url, type });
  };

  const closePreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setErrorMsg('You can only upload up to 5 images.');
      return;
    }
    setErrorMsg('');
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check size limit: 30MB = 30 * 1024 * 1024 bytes = 31457280 bytes
    if (file.size > 31457280) {
      setErrorMsg('Video file size exceeds the 30MB limit.');
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }
    setErrorMsg('');
    setVideo(file);
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRadioToggle = (value) => {
    if (facedIssue === value) {
      if (value === 'yes') {
        const hasData = description.trim() !== '' || images.length > 0 || video !== null;
        if (!hasData) {
          setFacedIssue(null);
          setErrorMsg('');
        }
      } else if (value === 'no') {
        if (!rating) {
          setFacedIssue(null);
          setErrorMsg('');
        }
      }
    } else {
      // Trying to switch to a different option
      if (facedIssue === 'yes') {
        const hasData = description.trim() !== '' || images.length > 0 || video !== null;
        if (hasData) {
          setErrorMsg('Please clear your entered issue details before switching to "No".');
          return;
        }
      }
      setFacedIssue(value);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) return;
    setErrorMsg('');

    // Validation
    if (facedIssue === null) {
      setErrorMsg('Please select whether you faced an issue or not.');
      return;
    }

    if (facedIssue === 'no' && !rating) {
      setErrorMsg('Please select a rating.');
      return;
    }

    if (facedIssue === 'yes') {
      if (!description.trim() && images.length === 0 && !video) {
        setErrorMsg('Please provide at least one: problem details, images, or a video.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare payload
      let payload = {
        name: name.trim() || 'Anonymous',
        facedIssue,
        rating: facedIssue === 'no' ? rating : 'N/A',
        description: facedIssue === 'yes' ? description.trim() : 'N/A',
        images: [],
        video: null,
        ipAddress: clientIp || 'Unknown' // Attach IP here
      };

      // Convert images to base64
      if (facedIssue === 'yes' && images.length > 0) {
        payload.images = await Promise.all(
          images.map(async (img) => {
            return {
              name: img.name,
              mimeType: img.type,
              data: (await toBase64(img)).split(',')[1] // Extract base64 part
            };
          })
        );
      }

      // Convert video to base64
      if (facedIssue === 'yes' && video) {
        payload.video = {
          name: video.name,
          mimeType: video.type,
          data: (await toBase64(video)).split(',')[1]
        };
      }

      const scriptUrl = process.env.NEXT_PUBLIC_FEEDBACK_SCRIPT_URL;
      
      if (!scriptUrl || scriptUrl === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        // Simulate network request for testing without actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      // Technically, if limit was reached while they were typing, GAS could block them (though our GAS code currently just blindly accepts POSTs and returns success:true. It's fine since we blocked on mount).
      if (data.allowed === false) {
        setIsBlocked(true);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.pageContainer}>
        <motion.div 
          className={styles.successCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <CheckCircle size={64} className={styles.successIcon} />
          <h2 className={styles.successTitle}>Thank you for your feedback!</h2>
          <p className={styles.successText}>
            Thank you for your valuable feedback! Our team will review it carefully. Have a blessed day!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ filter: isBlocked ? 'blur(8px)' : 'none', pointerEvents: isBlocked ? 'none' : 'auto', position: 'relative' }}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>Your Feedback Matters</h1>
            <p className={styles.subtitle}>
              Your voice truly matters to us. We deeply appreciate any thoughts or suggestions you share, as they help us create a better experience for everyone.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Name (Optional)</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Issue Radio */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Did you face any problem/glitch/issue/bug anywhere in the website? *
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="issue" 
                    value="yes"
                    checked={facedIssue === 'yes'}
                    onChange={() => {}}
                    onClick={() => handleRadioToggle('yes')}
                  />
                  <span className={styles.customRadio}></span>
                  Yes, I faced an issue
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="issue" 
                    value="no"
                    checked={facedIssue === 'no'}
                    onChange={() => {}}
                    onClick={() => handleRadioToggle('no')}
                  />
                  <span className={styles.customRadio}></span>
                  No, everything was fine
                </label>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {facedIssue === 'no' && (
                <motion.div 
                  key="rating-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.conditionalSection}
                >
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      How much would you rate our website on a scale of 10? *
                    </label>
                    <div className={styles.ratingGrid}>
                      {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                        <button
                          type="button"
                          key={num}
                          className={`${styles.ratingBtn} ${rating === String(num) ? styles.ratingActive : ''}`}
                          onClick={() => setRating(String(num))}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className={styles.ratingLabels}>
                      <span>1 (Not Satisfactory)</span>
                      <span>10 (Very Satisfied)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {facedIssue === 'yes' && (
                <motion.div 
                  key="issue-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.conditionalSection}
                >
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Describe briefly the problem/glitch/issue/bug you faced.
                    </label>
                    <textarea 
                      className={styles.textarea} 
                      placeholder="Provide details here..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className={styles.uploadRow}>
                    {/* Image Upload */}
                    <div className={styles.uploadBox}>
                      <label className={styles.uploadLabel}>
                        <div className={styles.uploadIconWrapper}>
                          <ImageIcon size={24} />
                        </div>
                        <span className={styles.uploadText}>Upload Images (Max 5)</span>
                        <span className={styles.uploadHint}>Accepted: .jpg, .png, .webp, .gif</span>
                        <input 
                          type="file" 
                          accept="image/jpeg, image/png, image/webp, image/gif"
                          multiple
                          className={styles.fileInput}
                          ref={imagesInputRef}
                          onChange={handleImageChange}
                        />
                      </label>
                      {images.length > 0 && (
                        <div className={styles.fileList}>
                          {images.map((img, idx) => (
                            <div key={idx} className={styles.fileItem}>
                              <span className={styles.fileName} onClick={() => openPreview(img, 'image')}>{img.name}</span>
                              <button type="button" onClick={() => removeImage(idx)} className={styles.removeBtn}>
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Video Upload */}
                    <div className={styles.uploadBox}>
                      <label className={styles.uploadLabel}>
                        <div className={styles.uploadIconWrapper}>
                          <Video size={24} />
                        </div>
                        <span className={styles.uploadText}>Upload Video (Max 1)</span>
                        <span className={styles.uploadHint}>Limit: 30MB max</span>
                        <input 
                          type="file" 
                          accept="video/*"
                          className={styles.fileInput}
                          ref={videoInputRef}
                          onChange={handleVideoChange}
                        />
                      </label>
                      {video && (
                        <div className={styles.fileList}>
                          <div className={styles.fileItem}>
                            <span className={styles.fileName} onClick={() => openPreview(video, 'video')}>{video.name}</span>
                            <button type="button" onClick={removeVideo} className={styles.removeBtn}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={styles.errorAlert}
                >
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isSubmitting || isChecking}
            >
              {isSubmitting || isChecking ? (
                <span className={styles.loader}></span>
              ) : (
                'Submit Feedback'
              )}
            </button>

          </form>
        </motion.div>

        {isBlocked && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '2rem 3rem',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                textAlign: 'center',
                border: '1px solid rgba(128,0,0,0.2)',
                pointerEvents: 'auto'
              }}
            >
              <AlertCircle size={48} color="#800000" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '0.5rem' }}>Feedback Limit Reached</h3>
              <p style={{ color: '#4b5563', maxWidth: '300px', margin: '0 auto' }}>
                You have already submitted the maximum allowed number of feedbacks.
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {mounted && typeof window !== 'undefined' ? createPortal(
        <AnimatePresence>
          {previewFile && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePreview}
            >
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button type="button" className={styles.modalCloseBtn} onClick={closePreview}>
                  <X size={20} />
                </button>
                {previewFile.type === 'image' ? (
                  <img src={previewFile.url} alt="Preview" className={styles.modalImage} />
                ) : (
                  <video src={previewFile.url} controls autoPlay className={styles.modalVideo} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </>
  );
}
