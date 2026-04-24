export default function DLLogo({ size = 26 }) {
  return (
    <img
      src="/logo.svg?v=3"
      width={size}
      height={size}
      alt="DiagnoLens"
      style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
    />
  );
}
