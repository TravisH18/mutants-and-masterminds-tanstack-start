import CityGenerator from '@/components/CityGenerator';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/map-test')({
  component: MapTest
});

function MapTest() {
  return (
    <div className="h-screen w-screen">
      <CityGenerator />
    </div>
  );
}