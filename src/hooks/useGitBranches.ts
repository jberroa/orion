import { useState, useEffect, useCallback } from 'react';

interface Branch {
  value: string;
  label: string;
}

export function useGitBranches(gitUrl: string, options?: { enabled?: boolean }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    if (!gitUrl) {
      setBranches([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electron.invoke('get-git-branches', gitUrl);
      const formattedBranches: Branch[] = result.map((branch: string) => ({
        value: branch,
        label: branch
      }));
      setBranches(formattedBranches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      setBranches([{
        value: "local",
        label: "local"
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [gitUrl]);

  return { branches, isLoading, error, fetchBranches };
} 