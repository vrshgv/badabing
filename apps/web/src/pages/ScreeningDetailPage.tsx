import { useParams } from 'react-router';

export function ScreeningDetailPage() {
  const { id } = useParams<{ id: string }>();

  return <h1>Screening {id}</h1>
}