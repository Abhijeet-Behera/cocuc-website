
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import {
  Smartphone,
  CreditCard,
  Copy,
  Check,
  Info,
  AlertCircle,
} from 'lucide-react'

import { paymentConfig } from '@/lib/paymentConfig'
import styles from './DonationSection.module.css'
import Reveal from './Reveal'

const INITIAL_FORM_DATA = {
  fullName: '',
  category: '',
  customCategory: '',
  amount: '',
  message: '',
  consent: false,
}

export default function DonationSection() {
  const [activeTab, setActiveTab] = useState('upi')
  const [copyStatus, setCopyStatus] = useState({})

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [, setSubmissionReference] = useState('')

  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const containerRef = useRef(null)

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000'

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const donationGrid = containerRef.current?.querySelector(
        `.${styles.donationGrid}`
      )

      if (!donationGrid) {
        return
      }

      gsap.fromTo(
        donationGrid,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
          },
        }
      )
    }, containerRef)

    return () => context.revert()
  }, [])

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    const nextValue =
      type === 'checkbox'
        ? checked
        : value

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: nextValue,
      }

      if (
        name === 'category' &&
        value !== 'Other'
      ) {
        updated.customCategory = ''
      }

      return updated
    })

    setSubmitError('')

    if (fieldErrors[name]) {
      setFieldErrors((previous) => {
        const updated = { ...previous }
        delete updated[name]
        return updated
      })
    }

    if (
      name === 'category' &&
      value !== 'Other' &&
      fieldErrors.customCategory
    ) {
      setFieldErrors((previous) => {
        const updated = { ...previous }
        delete updated.customCategory
        return updated
      })
    }
  }

  const copyToClipboard = async (text, key) => {
    if (!text) {
      return
    }

    try {
      await navigator.clipboard.writeText(String(text))

      setCopyStatus((previous) => ({
        ...previous,
        [key]: true,
      }))

      window.setTimeout(() => {
        setCopyStatus((previous) => ({
          ...previous,
          [key]: false,
        }))
      }, 2000)
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  }

  const validate = () => {
    const errors = {}

    const fullName = formData.fullName.trim()
    const amount = Number(formData.amount)

    if (!fullName) {
      errors.fullName = 'Full Name is required.'
    }

    if (!formData.category) {
      errors.category = 'Please select an offering category.'
    }

    if (
      formData.category === 'Other' &&
      !formData.customCategory.trim()
    ) {
      errors.customCategory = 'Custom category is required.'
    }

    if (
      !formData.amount ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      errors.amount = 'Amount must be greater than zero.'
    }

    if (!formData.consent) {
      errors.consent = 'Please confirm that the information is correct.'
    }

    setFieldErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event?.preventDefault()

    if (submitted || submitting) {
      return
    }

    if (!validate()) {
      return
    }

    setSubmitError('')
    setSubmitting(true)

    try {
      const response = await fetch(
        `${API_URL}/donation_submit.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            mobileNumber: '',
            email: '',
            category: formData.category,
            customCategory: formData.customCategory.trim(),
            amount: formData.amount,
            message: formData.message.trim(),
            paymentMode:
              activeTab === 'upi'
                ? 'upi'
                : 'neft_rtgs',
            status: 'DETAILS_SUBMITTED',
            consent: formData.consent,
          }),
        }
      )

      const responseText = await response.text()

      let result = {}

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {}
      } catch {
        result = {}
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
          result.message ||
          'Unable to submit your details at the moment.'
        )
      }

      setSubmissionReference(
        result.submissionReference || ''
      )

      setSubmitted(true)
      setSubmitError('')
      setFieldErrors({})

      window.requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your details at the moment. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnotherDonation = () => {
    setFormData({ ...INITIAL_FORM_DATA })
    setActiveTab('upi')
    setCopyStatus({})
    setSubmitting(false)
    setSubmitted(false)
    setSubmissionReference('')
    setSubmitError('')
    setFieldErrors({})

    window.requestAnimationFrame(() => {
      document
        .getElementById('don-name')
        ?.focus()
    })
  }

  return (
    <section
      className={`section ${styles.donationSection}`}
      ref={containerRef}
      id="donate"
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}
        >
          <Reveal delay={0.1}>
            <h2 className="section-title-elegant">
              <span className="title-normal">
                Tithe, Offering &{' '}
              </span>

              <em className="title-italic">
                Donation
              </em>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className={styles.subtitle}>
              Support the ministry through your
              faithful giving.
            </p>
          </Reveal>
        </div>

        {/* Bible Verse */}
        <Reveal delay={0.2}>
          <blockquote className={styles.verse}>
            <p className={styles.verseText}>
              “Each of you should give what you have
              decided in your heart to give… for God
              loves a cheerful giver.”
            </p>

            <cite className={styles.verseRef}>
              — 2 Corinthians 9:7
            </cite>
          </blockquote>
        </Reveal>

        {/* Thank-you screen or donation form */}
        {submitted ? (
          <div
            className={styles.thankYouCard}
            role="status"
            aria-live="polite"
          >
            <div className={styles.thankYouIcon}>
              <Check size={34} />
            </div>

            <h3 className={styles.thankYouTitle}>
              Thank You for Your Offering
            </h3>

            <p className={styles.thankYouText}>
              Your offering details have been
              submitted successfully. May God bless
              your generous heart.
            </p>

            <p className={styles.verificationNote}>
              Your details have been recorded. This
              confirmation does not automatically
              verify that the payment has been
              received in the bank account.
            </p>

            <button
              type="button"
              className={
                styles.anotherDonationBtn
              }
              onClick={handleAnotherDonation}
            >
              MAKE ANOTHER DONATION
            </button>
          </div>
        ) : (
          <div className={styles.donationGrid}>
            {/* Left: Offering Details */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTag}>
                  Support the Ministry
                </span>

                <h3 className={styles.panelTitle}>
                  Offering Details
                </h3>
              </div>

              <form
                className={styles.panelBody}
                onSubmit={handleSubmit}
                noValidate
              >
                <Field
                  id="don-name"
                  label="Full Name *"
                  error={fieldErrors.fullName}
                >
                  <input
                    id="don-name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                </Field>

                <Field
                  id="don-cat"
                  label="Offering Category *"
                  error={fieldErrors.category}
                >
                  <select
                    id="don-cat"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="Tithe">
                      Tithe
                    </option>

                    <option value="General Offering">
                      General Offering
                    </option>

                    <option value="Amenity Building Construction">
                      Amenity Building Construction
                    </option>

                    <option value="Media House Production">
                      Media House Production
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </Field>

                {formData.category ===
                  'Other' && (
                    <Field
                      id="don-custom"
                      label="Custom Category *"
                      error={
                        fieldErrors.customCategory
                      }
                    >
                      <input
                        id="don-custom"
                        type="text"
                        name="customCategory"
                        value={
                          formData.customCategory
                        }
                        onChange={
                          handleInputChange
                        }
                        className={styles.input}
                        placeholder="Specify the purpose"
                      />
                    </Field>
                  )}

                <Field
                  id="don-amount"
                  label="Intended Amount (₹) *"
                  error={fieldErrors.amount}
                >
                  <input
                    id="don-amount"
                    type="number"
                    name="amount"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </Field>

                <Field
                  id="don-msg"
                  label="Message / Purpose Note (Optional)"
                >
                  <textarea
                    id="don-msg"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Any message or specific instructions…"
                    maxLength={300}
                  />

                  <span
                    className={styles.charCount}
                  >
                    {formData.message.length} / 300
                  </span>
                </Field>

                {/* Confirmation checkbox */}
                <label
                  className={`${styles.checkboxRow} ${fieldErrors.consent
                      ? styles.checkboxError
                      : ''
                    }`}
                >
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />

                  <span
                    className={styles.checkboxLabel}
                  >
                    I confirm that the information
                    entered above is correct and may
                    be used for donation records and
                    payment reconciliation.
                  </span>
                </label>

                {fieldErrors.consent && (
                  <p
                    className={styles.fieldError}
                    role="alert"
                  >
                    {fieldErrors.consent}
                  </p>
                )}

                {/* Submit button appears only after consent */}
                {formData.consent && (
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting
                      ? 'SUBMITTING…'
                      : 'SUBMIT DETAILS'}
                  </button>
                )}

                {/* Submission error */}
                {submitError && (
                  <div
                    className={styles.errorMsg}
                    role="alert"
                  >
                    <AlertCircle
                      size={18}
                      aria-hidden="true"
                    />

                    <p>{submitError}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Payment Methods */}
            <div
              className={styles.panel}
              id="payment-panel"
            >
              <div className={styles.panelHeader}>
                <span className={styles.panelTag}>
                  Choose Payment Method
                </span>

                <h3 className={styles.panelTitle}>
                  Payment
                </h3>
              </div>

              <div className={styles.panelBody}>
                {/* Payment tabs */}
                <div
                  className={styles.tabs}
                  role="tablist"
                  aria-label="Payment method"
                >
                  <button
                    type="button"
                    role="tab"
                    id="upi-tab"
                    aria-selected={
                      activeTab === 'upi'
                    }
                    aria-controls="upi-panel"
                    className={`${styles.tab} ${activeTab === 'upi'
                        ? styles.activeTab
                        : ''
                      }`}
                    onClick={() =>
                      setActiveTab('upi')
                    }
                  >
                    <Smartphone
                      size={18}
                      aria-hidden="true"
                    />

                    UPI / QR Code
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="neft-tab"
                    aria-selected={
                      activeTab === 'neft'
                    }
                    aria-controls="neft-panel"
                    className={`${styles.tab} ${activeTab === 'neft'
                        ? styles.activeTab
                        : ''
                      }`}
                    onClick={() =>
                      setActiveTab('neft')
                    }
                  >
                    <CreditCard
                      size={18}
                      aria-hidden="true"
                    />

                    NEFT / RTGS
                  </button>
                </div>

                {/* UPI Panel */}
                {activeTab === 'upi' && (
                  <div
                    id="upi-panel"
                    role="tabpanel"
                    aria-labelledby="upi-tab"
                  >
                    <div
                      className={styles.qrBlock}
                    >
                      <p
                        className={
                          styles.scanLabel
                        }
                      >
                        Scan & Pay
                      </p>

                      <div
                        className={
                          styles.qrFrame
                        }
                      >
                        <Image
                          src={
                            paymentConfig.upi
                              .qrPath
                          }
                          alt={`UPI QR Code for ${paymentConfig.upi.payeeName}`}
                          width={200}
                          height={200}
                          priority={false}
                          style={{
                            display: 'block',
                            width: '100%',
                            height: 'auto',
                            maxWidth: '200px',
                          }}
                        />
                      </div>

                      <div
                        className={styles.upiRow}
                      >
                        <span
                          className={
                            styles.upiId
                          }
                        >
                          {paymentConfig.upi.id}
                        </span>

                        <button
                          type="button"
                          className={
                            styles.copyBtn
                          }
                          onClick={() =>
                            copyToClipboard(
                              paymentConfig.upi
                                .id,
                              'upi'
                            )
                          }
                          aria-label="Copy UPI ID"
                        >
                          {copyStatus.upi ? (
                            <Check size={15} />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                      </div>

                      {copyStatus.upi && (
                        <p
                          className={
                            styles.copied
                          }
                          role="status"
                        >
                          UPI ID Copied!
                        </p>
                      )}

                      <p
                        className={styles.hint}
                      >
                        Scan the QR code using any UPI
                        app to complete your offering.
                      </p>
                    </div>
                  </div>
                )}

                {/* NEFT / RTGS Panel */}
                {activeTab === 'neft' && (
                  <div
                    id="neft-panel"
                    role="tabpanel"
                    aria-labelledby="neft-tab"
                  >
                    <div
                      className={
                        styles.bankDetails
                      }
                    >
                      <BankRow
                        label="Bank Name"
                        value={
                          paymentConfig.bank
                            .bankName
                        }
                        copyKey="bankName"
                        onCopy={copyToClipboard}
                        copyStatus={copyStatus}
                      />

                      <BankRow
                        label="Branch"
                        value={
                          paymentConfig.bank
                            .branch
                        }
                        copyKey="branch"
                        onCopy={copyToClipboard}
                        copyStatus={copyStatus}
                      />

                      <BankRow
                        label="Account No"
                        value={
                          paymentConfig.bank
                            .accountNumber
                        }
                        copyKey="accNum"
                        onCopy={copyToClipboard}
                        copyStatus={copyStatus}
                      />

                      <BankRow
                        label="Account Name"
                        value={
                          paymentConfig.bank
                            .accountName
                        }
                        copyKey="accName"
                        onCopy={copyToClipboard}
                        copyStatus={copyStatus}
                      />

                      <BankRow
                        label="Account Type"
                        value={
                          paymentConfig.bank
                            .accountType
                        }
                        copyKey="accType"
                        onCopy={copyToClipboard}
                        copyStatus={copyStatus}
                      />

                      <BankRow
                        label="IFSC"
                        value={
                          paymentConfig.bank
                            .ifscCode
                        }
                        copyKey="ifsc"
                        onCopy={copyToClipboard}
                        copyStatus={copyStatus}
                      />

                      {paymentConfig.bank.micrCode && (
                        <BankRow
                          label="MICR"
                          value={
                            paymentConfig.bank
                              .micrCode
                          }
                          copyKey="micr"
                          onCopy={copyToClipboard}
                          copyStatus={copyStatus}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Security notice */}
                <div className={styles.notice}>
                  <Info
                    size={15}
                    color="#92400e"
                    aria-hidden="true"
                  />

                  <p>
                    Never share your UPI PIN, banking
                    password or OTP with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* Field wrapper with error display */
function Field({
  id,
  label,
  error,
  children,
}) {
  return (
    <div className={styles.formGroup}>
      <label
        htmlFor={id}
        className={styles.label}
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          className={styles.fieldError}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/* Bank detail row */
function BankRow({
  label,
  value,
  copyKey,
  onCopy,
  copyStatus,
}) {
  return (
    <div className={styles.bankRow}>
      <span className={styles.bankLabel}>
        {label}
      </span>

      <span className={styles.bankValue}>
        {value}

        {copyKey && (
          <button
            type="button"
            className={styles.copyBtn}
            onClick={() =>
              onCopy(value, copyKey)
            }
            aria-label={`Copy ${label}`}
          >
            {copyStatus?.[copyKey] ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </span>
    </div>
  )
}

