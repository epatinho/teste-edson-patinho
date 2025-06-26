export const formatReleaseDate = (releaseDate: string): string => {
  if (!releaseDate) return 'Data desconhecida';

  if (releaseDate.length === 4) {
    return releaseDate;
  }

  try {
    const date = new Date(releaseDate);

    if (isNaN(date.getTime())) {
      return releaseDate;
    }

    if (releaseDate.length === 7) {
      return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    }

    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (error) {
    return releaseDate;
  }
};

export const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
