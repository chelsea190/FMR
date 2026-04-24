import { NextResponse } from 'next/server';

const sampleDrugs = [
  { id: 'paracetamol', name: 'Paracetamol', category: 'Pain relief', dosage: '500mg' },
  { id: 'amoxicillin', name: 'Amoxicillin', category: 'Antibiotic', dosage: '250mg' },
  { id: 'salbutamol', name: 'Salbutamol Inhaler', category: 'Respiratory', dosage: '100mcg' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const data = query ? sampleDrugs.filter((drug) => drug.name.toLowerCase().includes(query)) : sampleDrugs;
  return NextResponse.json(data);
}
