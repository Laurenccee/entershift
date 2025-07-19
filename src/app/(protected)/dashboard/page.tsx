import { Button } from '@/components/ui/button';
import React from 'react';

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Button>Logout</Button>
    </div>
  );
}

export default Dashboard;
