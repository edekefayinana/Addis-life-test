import { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      phone?: string;
      approvalStatus?: 'PENDING' | 'APPROVED';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
    phone?: string;
    approvalStatus?: 'PENDING' | 'APPROVED';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    phone?: string;
    approvalStatus?: 'PENDING' | 'APPROVED';
  }
}
