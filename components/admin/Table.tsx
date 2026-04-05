export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        {children}
      </table>
    </div>
  )
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th>{children}</th>
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>
}

export function TD({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td style={right ? { textAlign: 'right' } : undefined}>{children}</td>
}

