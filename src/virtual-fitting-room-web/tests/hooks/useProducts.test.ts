import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProducts } from '../../src/hooks/useProducts';
import { productService } from '../../src/services/productService';
import { pantsFixture, shirtFixture } from '../fixtures/products';

vi.mock('../../src/services/productService', () => ({
  productService: { getAll: vi.fn() },
}));

describe('useProducts', () => {
  beforeEach(() => {
    vi.mocked(productService.getAll).mockResolvedValue([shirtFixture, pantsFixture]);
  });

  it('useProducts_BeforeServiceResolves_ReturnsLoadingState', async () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.products).toEqual([]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('useProducts_AfterServiceResolves_ReturnsProducts', async () => {
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toEqual([shirtFixture, pantsFixture]);
  });
});
