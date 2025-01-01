import { useState, useEffect } from 'react';

interface Branch {
  value: string;
  label: string;
}

export function useGitBranches(gitUrl: string) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
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
        setBranches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [gitUrl]);

  return { branches, isLoading, error };
} 