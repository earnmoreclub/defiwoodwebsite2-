import { redirect } from 'next/navigation';

// Root page redirects to default locale (zh-TW)
export default function RootPage() {
  redirect('/zh-TW');
}