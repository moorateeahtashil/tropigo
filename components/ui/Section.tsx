type Props = {
  id?: string
  bg?: 'white' | 'surface' | 'container' | 'transparent'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export default function Section({ id, bg = 'white', padding = 'lg', children, className }: Props) {
  const bgCls =
    bg === 'white' ? 'bg-white' : bg === 'surface' ? 'bg-surface' : bg === 'container' ? 'bg-surface-container-low' : ''
  const py = padding === 'sm' ? 'py-8' : padding === 'md' ? 'py-12' : 'py-16'
  return (
    <section id={id} className={`${bgCls} ${py} ${className || ''}`}>
      <div className="px-6 md:px-12 max-w-7xl mx-auto">{children}</div>
    </section>
  )
}

