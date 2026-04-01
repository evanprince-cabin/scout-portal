'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { useToast } from '@/lib/toast'

// ---- Types ----

interface Referral {
  id: string
  prospect_name: string
  company: string
  service_interest: string | null
  status: string
  created_at: string
}

interface FormState {
  prospect_name: string
  company: string
  email: string
  phone: string
  service_interest: string
  notes: string
}

interface FormErrors {
  prospect_name?: string
  company?: string
  email?: string
}

// ---- Constants ----

const SERVICE_OPTIONS = [
  'Strategy & Innovation',
  'Product Design',
  'Software Engineering',
  'Salesforce & Business Systems',
  'Not Sure',
]

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  submitted:        { label: 'Submitted',        classes: 'bg-cabin-stone/20 text-cabin-stone' },
  contacted:        { label: 'Contacted',        classes: 'bg-cabin-sky text-indigo-800' },
  in_conversations: { label: 'In Conversations', classes: 'bg-cabin-gold/30 text-yellow-800' },
  proposal_sent:    { label: 'Proposal Sent',    classes: 'bg-purple-100 text-purple-800' },
  closed_won:       { label: 'Closed Won',       classes: 'bg-green-100 text-green-800' },
  closed_lost:      { label: 'Closed Lost',      classes: 'bg-red-100 text-red-800' },
}

const EMPTY_FORM: FormState = {
  prospect_name: '',
  company: '',
  email: '',
  phone: '',
  service_interest: '',
  notes: '',
}

// ---- Helpers ----

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function inputClasses(hasError: boolean) {
  return [
    'w-full rounded-full px-4 py-2.5',
    'border bg-white',
    hasError ? 'border-cabin-flame' : 'border-cabin-stone/30',
    'text-sm font-inter text-cabin-charcoal',
    'placeholder:text-cabin-stone/60',
    'focus:outline-none focus:border-cabin-maroon focus:ring-2 focus:ring-cabin-maroon/10',
    'transition-colors duration-150',
  ].join(' ')
}

// ---- Sub-components ----

function FieldWrapper({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-inter font-medium text-cabin-charcoal">
        {label}
        {required && <span className="text-cabin-flame ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-cabin-flame">{error}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    classes: 'bg-cabin-stone/20 text-cabin-stone',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-inter ${config.classes}`}
    >
      {config.label}
    </span>
  )
}

// ---- Form ----

function ReferralForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.prospect_name.trim()) next.prospect_name = 'Prospect name is required.'
    if (!form.company.trim()) next.company = 'Company is required.'
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setForm(EMPTY_FORM)
      setErrors({})
      showToast("Referral submitted! We'll be in touch.", 'success')
      onSuccess()
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <div className="border-l-4 border-cabin-flame pl-4 mb-6">
        <p className="font-inter text-sm italic text-cabin-stone">
          Know someone who could use Cabin&apos;s help? Send them our way — we&apos;ll take it from there.
        </p>
      </div>
      <h2 className="font-geist font-semibold text-lg text-cabin-charcoal mb-6">
        Submit a Referral
      </h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldWrapper label="Prospect First & Last Name" required error={errors.prospect_name}>
              <input
                type="text"
                placeholder="Jane Smith"
                value={form.prospect_name}
                onChange={set('prospect_name')}
                className={inputClasses(!!errors.prospect_name)}
              />
            </FieldWrapper>
            <FieldWrapper label="Company" required error={errors.company}>
              <input
                type="text"
                placeholder="Acme Corp"
                value={form.company}
                onChange={set('company')}
                className={inputClasses(!!errors.company)}
              />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldWrapper label="Email" required error={errors.email}>
              <input
                type="email"
                placeholder="jane@acme.com"
                value={form.email}
                onChange={set('email')}
                className={inputClasses(!!errors.email)}
              />
            </FieldWrapper>
            <FieldWrapper label="Phone (optional)">
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={set('phone')}
                className={inputClasses(false)}
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Service Interest">
            <select
              value={form.service_interest}
              onChange={set('service_interest')}
              className={`${inputClasses(false)} appearance-none`}
            >
              <option value="">Select a service...</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="Notes (optional)">
            <textarea
              rows={4}
              placeholder="Any context or background that would help Cabin..."
              value={form.notes}
              onChange={set('notes')}
              className="
                w-full rounded-2xl px-4 py-3
                border border-cabin-stone/30 bg-white
                text-sm font-inter text-cabin-charcoal
                placeholder:text-cabin-stone/60
                focus:outline-none focus:border-cabin-maroon focus:ring-2 focus:ring-cabin-maroon/10
                transition-colors duration-150 resize-none
              "
            />
          </FieldWrapper>

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? 'Submitting...' : 'Submit Referral'}
          </Button>
        </form>
    </Card>
  )
}

// ---- Table ----

function ReferralTable({ refreshKey }: { refreshKey: number }) {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReferrals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/referrals')
      if (res.ok) {
        const data = await res.json()
        setReferrals(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReferrals()
  }, [fetchReferrals, refreshKey])

  return (
    <div>
      <h2 className="font-inter font-semibold text-sm uppercase tracking-widest text-cabin-stone mb-4">Your Referrals</h2>

      {loading ? (
        <Card hover={false}>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      ) : referrals.length === 0 ? (
        <Card hover={false}>
          <EmptyState
            heading="No referrals yet. Who in your network could use Cabin?"
            subtext="Your submitted referrals and their statuses will appear here."
          />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card hover={false} className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-inter">
                <thead>
                  <tr className="border-b border-cabin-mauve">
                    <th className="text-left py-3 px-2 font-medium text-cabin-stone">
                      Prospect Name
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-cabin-stone">Company</th>
                    <th className="text-left py-3 px-2 font-medium text-cabin-stone">
                      Service Interest
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-cabin-stone">
                      Date Submitted
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-cabin-stone">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cabin-mauve/50">
                  {referrals.map((r) => (
                    <tr key={r.id} className="hover:bg-cabin-linen/50 transition-colors">
                      <td className="py-3.5 px-2 font-medium text-cabin-charcoal">
                        {r.prospect_name}
                      </td>
                      <td className="py-3.5 px-2 text-cabin-stone">{r.company}</td>
                      <td className="py-3.5 px-2 text-cabin-stone">
                        {r.service_interest ?? '—'}
                      </td>
                      <td className="py-3.5 px-2 text-cabin-stone">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="py-3.5 px-2">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {referrals.map((r) => (
              <Card key={r.id} hover={false}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-inter font-medium text-cabin-charcoal">{r.prospect_name}</p>
                    <p className="text-sm text-cabin-stone mt-0.5">{r.company}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.service_interest && (
                  <p className="text-sm text-cabin-stone mt-2">{r.service_interest}</p>
                )}
                <p className="text-xs text-cabin-stone/60 mt-2">{formatDate(r.created_at)}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ---- Main export ----

export default function ReferralsClient() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-8">
      <ReferralForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      <ReferralTable refreshKey={refreshKey} />
    </div>
  )
}
