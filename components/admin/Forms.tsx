"use client"

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span style={{ fontSize: '0.75rem', color: 'var(--a-text-faint)' }}>{hint}</span>}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return <input {...rest} className={`admin-input${className ? ' ' + className : ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props
  return <textarea {...rest} className={`admin-textarea${className ? ' ' + className : ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props
  return <select {...rest} className={`admin-select${className ? ' ' + className : ''}`} />
}

export function Switch({ checked, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className="admin-switch"
      aria-pressed={checked}
    >
      <span className="admin-switch-knob" />
    </button>
  )
}

export function Button({
  variant = 'primary',
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'danger' }) {
  const variantClass = {
    primary: 'admin-btn-primary',
    outline: 'admin-btn-outline',
    ghost:   'admin-btn-ghost',
    danger:  'admin-btn-danger',
  }[variant]
  return (
    <button {...rest} className={`admin-btn ${variantClass}${rest.className ? ' ' + rest.className : ''}`}>
      {children}
    </button>
  )
}
