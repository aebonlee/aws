interface FilterTab {
  value: string
  label: string
}

interface FilterTabsProps {
  tabs: readonly FilterTab[]
  active: string
  onChange: (value: string) => void
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="community-filter-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`community-filter-tab${active === tab.value ? ' active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
