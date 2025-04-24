import { redirect } from 'next/navigation';

export default function Home() {
  // making redirect to the dashboard
  redirect('/dashboard');
}