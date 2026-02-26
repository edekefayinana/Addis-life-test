/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: (project: { id: string; name: string }) => void;
}

export function ProjectModal({
  open,
  onClose,
  onProjectCreated,
}: ProjectModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Failed to create project');

      const project = await res.json();
      onProjectCreated(project);
      setName('');
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        {/* Bottom Sheet */}
        <DialogPrimitive.Content
          className="
            fixed bottom-0 left-0 right-0
            z-50
            bg-white
            rounded-t-3xl
            p-6
            shadow-2xl
            w-full
            max-w-lg
            mx-auto
            flex flex-col gap-5
            animate-in slide-in-from-bottom duration-300
          "
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-2" />

          <DialogPrimitive.Title className="text-xl font-bold">
            Create Project
          </DialogPrimitive.Title>

          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="h-12 text-lg rounded-xl"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button
            onClick={handleCreate}
            disabled={loading || !name}
            className="h-11 text-lg font-semibold rounded-xl"
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
