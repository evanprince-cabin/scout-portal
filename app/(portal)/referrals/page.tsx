'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'

const serviceOptions = [
  'Strategy & Innovation',
  'Product Design',
  'Software Engineering',
  'Salesforce & Business Systems',
  'Not Sure',
]

function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  id: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-inter font-medium text-cabin-charcoal">
        {label}
        {required && <span className="text-cabin-flame ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="
          w-full rounded-full px-4 py-2.5
          border border-cabin-stone/30 bg-white
          text-sm font-inter text-cabin-charcoal
          placeholder:text-cabin-stone/60
          focus:outline-none focus:border-cabin-maroon focus:ring-2 focus:ring-cabin-maroon/10
          transition-colors duration-150
        "
      />
    </div>
  )
}

export default function ReferralsPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setToast({ message: 'Referral submitted successfully!', type: 'success' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Referrals</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Submit a new referral or track existing ones below.
        </p>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <h2 className="font-geist font-semibold text-lg text-cabin-charcoal mb-6">
          Submit a Referral
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Prospect Name" id="prospect_name" placeholder="Jane Smith" required />
            <InputField label="Company" id="company" placeholder="Acme Corp" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Email" id="email" type="email" placeholder="jane@acme.com" required />
            <InputField label="Phone" id="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>

          {/* Service interest */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="service_interest" className="text-sm font-inter font-medium text-cabin-charcoal">
              Service Interest
            </label>
            <select
              id="service_interest"
              name="service_interest"
              className="
                w-full rounded-full px-4 py-2.5
                border border-cabin-stone/30 bg-white
                text-sm font-inter text-cabin-charcoal
                focus:outline-none focus:border-cabin-maroon focus:ring-2 focus:ring-cabin-maroon/10
                transition-colors duration-150
                appearance-none
              "
            >
              <option value="">Select a service...</option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-inter font-medium text-cabin-charcoal">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Any context or background that would help Cabin..."
              className="
                w-full rounded-2xl px-4 py-3
                border border-cabin-stone/30 bg-white
                text-sm font-inter text-cabin-charcoal
                placeholder:text-cabin-stone/60
                focus:outline-none focus:border-cabin-maroon focus:ring-2 focus:ring-cabin-maroon/10
                transition-colors duration-150 resize-none
              "
            />
          </div>

          <Button type="submit" variant="primary">
            Submit Referral
          </Button>
        </form>
      </Card>

      {/* Referral table placeholder */}
      <div>
        <h2 className="font-geist font-semibold text-lg text-cabin-charcoal mb-4">
          Your Referrals
        </h2>
        <Card hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="border-b border-cabin-mauve">
                  <th className="text-left py-3 px-2 font-medium text-cabin-stone">Prospect</th>
                  <th className="text-left py-3 px-2 font-medium text-cabin-stone">Company</th>
                  <th className="text-left py-3 px-2 font-medium text-cabin-stone">Service</th>
                  <th className="text-left py-3 px-2 font-medium text-cabin-stone">Submitted</th>
                  <th className="text-left py-3 px-2 font-medium text-cabin-stone">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-12 text-center text-cabin-stone">
                    No referrals submitted yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
