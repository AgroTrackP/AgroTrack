// src/app/(admin)/dashboard/users/page.tsx

// 1. IMPORTA EL TIPO Y EL COMPONENTE
import { UsersClient } from './components/user-client';



export default async function UsersPage() {

  return (
    <div className="space-y-6">
     

      <UsersClient/>
    </div>
  );
}