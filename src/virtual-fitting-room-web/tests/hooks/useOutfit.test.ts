import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useOutfit } from '../../src/hooks/useOutfit';
import { pantsFixture, shirtFixture } from '../fixtures/products';

describe('useOutfit', () => {
  it('useOutfit_OnStart_ReturnsEmptyOutfit', () => {
    const { result } = renderHook(() => useOutfit());

    expect(result.current.outfit).toEqual({ shirt: null, pants: null });
    expect(result.current.selectedProductIds).toEqual([]);
  });

  it('selectProduct_WithShirt_SetsShirt', () => {
    const { result } = renderHook(() => useOutfit());

    act(() => result.current.selectProduct(shirtFixture));

    expect(result.current.outfit.shirt).toEqual(shirtFixture);
    expect(result.current.outfit.pants).toBeNull();
  });

  it('selectProduct_WithShirtAndPants_ReturnsBothSelectedIds', () => {
    const { result } = renderHook(() => useOutfit());

    act(() => result.current.selectProduct(shirtFixture));
    act(() => result.current.selectProduct(pantsFixture));

    expect(result.current.outfit.pants).toEqual(pantsFixture);
    expect(result.current.selectedProductIds).toEqual([shirtFixture.id, pantsFixture.id]);
  });

  it('removeProduct_WithShirtCategory_ClearsOnlyShirt', () => {
    const { result } = renderHook(() => useOutfit());
    act(() => result.current.selectProduct(shirtFixture));
    act(() => result.current.selectProduct(pantsFixture));

    act(() => result.current.removeProduct('shirt'));

    expect(result.current.outfit.shirt).toBeNull();
    expect(result.current.outfit.pants).toEqual(pantsFixture);
  });
});
