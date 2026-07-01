/**
 * Central configuration for payment details.
 * Replace these placeholder values with actual production data.
 */
export const paymentConfig = {
  organizationName: 'Church of Christ (Union Church), Bhubaneswar',
  upi: {
    id: 'unionchurch@bank', // Placeholder
    payeeName: 'Union Church Bhubaneswar',
    qrPath: '/payment-qr.png', // Ensure this image exists in public folder
  },
  bank: {
    accountName: 'CHURCH OF CHRIST, (UNION CHURCH) BHUBANESWAR',
    bankName: 'ODISHA GRAMYA BANK',
    accountNumber: '002001000004808',
    ifscCode: 'IOBA0ROGB01',
    branch: 'BHUBANESWAR BRANCH',
    accountType: 'Savings',
    micrCode: '751706002',
  },
  contact: {
    email: 'info@unionchurch.org.in',
    phone: '+91 9437400283',
  },
}
