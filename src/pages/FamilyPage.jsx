import { useFamily } from '../family/FamilyContext.jsx';
import FamilyOverview from '../components/FamilyOverview.jsx';

export default function FamilyPage() {
  const { members, loading } = useFamily();

  if (loading) return null;

  return <FamilyOverview members={members} />;
}
