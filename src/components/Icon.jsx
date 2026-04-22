import * as Icons from 'lucide-react';

function toPascalCase(name) {
  return name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

export default function Icon({ name, size = 16, color = 'currentColor', style }) {
  const LucideIcon = Icons[toPascalCase(name)];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={color} style={{ display: 'block', flexShrink: 0, ...style }} />;
}
