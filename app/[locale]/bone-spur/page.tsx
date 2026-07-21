import BoneSpurScreener from '@/components/bone-spur/BoneSpurScreener';

export default function BoneSpurPage({ params }: { params: { locale: string } }) {
  return <BoneSpurScreener locale={params.locale} />;
}
