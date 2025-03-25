import { Menu } from 'lucide-react'

interface MenuToggleProps {
  onClick: () => void
}

export function MenuToggle({ onClick }: MenuToggleProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-500 text-white"
    >
      <Menu size={24} />
    </button>
  )
}