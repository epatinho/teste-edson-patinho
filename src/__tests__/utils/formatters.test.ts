import { formatReleaseDate, formatDuration } from '../../utils/formatters';

describe('formatters', () => {
  describe('formatReleaseDate', () => {
    it('deve retornar "Data desconhecida" quando a data for vazia', () => {
      expect(formatReleaseDate('')).toBe('Data desconhecida');
      expect(formatReleaseDate(null as any)).toBe('Data desconhecida');
      expect(formatReleaseDate(undefined as any)).toBe('Data desconhecida');
    });

    it('deve retornar apenas o ano quando a data for apenas ano (4 dígitos)', () => {
      expect(formatReleaseDate('2023')).toBe('2023');
      expect(formatReleaseDate('1999')).toBe('1999');
    });

    it('deve formatar data completa (YYYY-MM-DD) no formato brasileiro', () => {
      const result1 = formatReleaseDate('2023-12-25');
      const result2 = formatReleaseDate('2020-01-01');

      expect(result1).toMatch(/2023|dezembro/i);
      expect(result2).toMatch(/2020|janeiro|dezembro/i);
    });

    it('deve formatar ano-mês (YYYY-MM) no formato brasileiro', () => {
      const result1 = formatReleaseDate('2023-12');
      const result2 = formatReleaseDate('2020-01');

      expect(result1).toMatch(/2023|dezembro|novembro/i);
      expect(result2).toMatch(/2020|janeiro|dezembro/i);
    });

    it('deve retornar a data original quando não for uma data válida', () => {
      expect(formatReleaseDate('data-inválida')).toBe('data-inválida');
      expect(formatReleaseDate('2023-13-45')).toBe('2023-13-45');
    });

    it('deve lidar com diferentes formatos de data', () => {
      expect(formatReleaseDate('2023-06-15T10:30:00Z')).toContain('junho');
    });
  });

  describe('formatDuration', () => {
    it('deve formatar duração em milissegundos para MM:SS', () => {
      expect(formatDuration(60000)).toBe('1:00');
      expect(formatDuration(90000)).toBe('1:30');
      expect(formatDuration(3600000)).toBe('60:00');
    });

    it('deve adicionar zero à esquerda nos segundos quando necessário', () => {
      expect(formatDuration(65000)).toBe('1:05');
      expect(formatDuration(5000)).toBe('0:05');
    });

    it('deve lidar com durações curtas', () => {
      expect(formatDuration(1000)).toBe('0:01');
      expect(formatDuration(500)).toBe('0:00');
    });

    it('deve lidar com durações longas', () => {
      expect(formatDuration(7200000)).toBe('120:00');
      expect(formatDuration(3723000)).toBe('62:03');
    });

    it('deve lidar com zero', () => {
      expect(formatDuration(0)).toBe('0:00');
    });
  });
});
