import { projects, featuredProjects, compactProjects } from './projects';

describe('projects data', () => {
  it('has no project titled Disasteroid or planet', () => {
    const titles = projects.map(p => p.title.toLowerCase());
    expect(titles.some(t => t.includes('disasteroid'))).toBe(false);
    expect(titles.some(t => t.includes('planet'))).toBe(false);
  });

  it('has exactly 4 featured projects', () => {
    expect(featuredProjects).toHaveLength(4);
  });

  it('all featured projects have an image path', () => {
    featuredProjects.forEach(p => {
      expect(p.image).toBeTruthy();
      expect(p.image).toMatch(/^\/img\/.+/);
    });
  });

  it('all projects have required fields', () => {
    projects.forEach(p => {
      expect(typeof p.id).toBe('string');
      expect(typeof p.title).toBe('string');
      expect(typeof p.description).toBe('string');
      expect(Array.isArray(p.tags)).toBe(true);
      expect(typeof p.featured).toBe('boolean');
    });
  });

  it('featuredProjects and compactProjects together equal all projects', () => {
    expect(featuredProjects.length + compactProjects.length).toBe(projects.length);
  });
});
