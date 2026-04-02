"use client"
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
      {children}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-secondary ' +
        (props.className || '')
      }
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        'w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-secondary min-h-[100px] ' +
        (props.className || '')
      }
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        'w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-secondary ' +
        (props.className || '')
      }
    />
  )
}

export function Switch({ checked, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={
        'w-12 h-6 rounded-full transition-colors ' +
        (checked ? 'bg-secondary' : 'bg-outline-variant')
      }
      aria-pressed={checked}
    >
      <span className={'block h-5 w-5 bg-white rounded-full mt-0.5 transition-transform ' + (checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  )
}

export function Button({ variant = 'primary', children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'outline'|'ghost' }) {
  const base = 'px-4 py-2 rounded-xl text-sm font-bold tracking-wider'
  const cls =
    variant === 'primary'
      ? 'bg-secondary text-on-secondary hover:opacity-90'
      : variant === 'outline'
        ? 'border border-outline-variant hover:bg-surface-container'
        : 'text-outline hover:bg-surface-container'
  return (
    <button {...rest} className={`${base} ${cls} ${rest.className || ''}`}>{children}</button>
  )
}
