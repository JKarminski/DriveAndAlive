/**
 * Frontend unit tests – useApi hook
 *
 * Tests the generic data-fetching hook without hitting a real network.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useApi } from "../../hooks/useApi";

describe("useApi hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts in loading state", () => {
    const fetcher = () => new Promise(() => {}); // never resolves
    const { result } = renderHook(() => useApi(fetcher));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("resolves data on success", async () => {
    const fetcher = vi.fn().mockResolvedValue({ success: true, value: 42 });
    const { result } = renderHook(() => useApi(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual({ success: true, value: 42 });
    expect(result.current.error).toBeNull();
  });

  it("captures error message on rejection", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useApi(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("re-fetches when deps change", async () => {
    let call = 0;
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve({ call: ++call })
    );

    const { result, rerender } = renderHook(
      ({ dep }: { dep: number }) => useApi(fetcher, [dep]),
      { initialProps: { dep: 1 } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetcher).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("exposes a refetch function", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useApi(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetcher).toHaveBeenCalledTimes(1);

    result.current.refetch();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("sets loading to true while fetching", async () => {
    let resolve: (v: unknown) => void;
    const fetcher = vi.fn().mockImplementation(
      () => new Promise((r) => { resolve = r; })
    );
    const { result } = renderHook(() => useApi(fetcher));

    expect(result.current.loading).toBe(true);
    resolve!({ done: true });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
