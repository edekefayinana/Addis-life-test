import UsersTable from '@/components/users/UsersTable';

export const metadata = {
  title: 'Users - Addis Life Agent',
  description:
    'Manage users of the Addis Life Agent platform, including agents and admins. View user details, approval status, and manage access.',
};

export default function UserManagment() {
  return <UsersTable />;
}
