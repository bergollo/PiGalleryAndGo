import React, { createRef } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";

import { PhotosProvider } from "../../context/PhotosContext";
import DropZone, { DropZoneRef } from "../DropZone";

// lightweight mocks
vi.mock("../context/PhotosContext", () => ({ usePhotos: () => ({ updatePhotos: vi.fn() }) }));
vi.mock("./FilePreview", () => ({ FilePreview: ({ filesData }: any) => <div data-testid="preview">{filesData?.map((f:any)=>f.name).join(",")||""}</div> }));
vi.mock("../styles/DropZone.module.css", () => ({ mainContainer: "main", dropzone: "dz", files: "files", uploadMessage: "msg", browse: "browse", uploadBtn: "btn" }));

const globalAny: any = global;
beforeEach(() => {
  globalAny.fetch = vi.fn();
});

describe("DropZone (light)", () => {
  it("renders file input", () => {
    render(<DropZone />, { wrapper: ({ children }) => <PhotosProvider>{children}</PhotosProvider> });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it("adds file via input and shows preview + upload button", async () => {
    render(<DropZone />, { wrapper: ({ children }) => <PhotosProvider>{children}</PhotosProvider> });
    const file = new File(["x"], "a.png", { type: "image/png" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText("a.png")).toBeTruthy();
    expect(screen.getByRole("button", { name: /upload/i })).toBeTruthy();
  });

  it("handles drop event and shows preview", async () => {
    render(<DropZone />, { wrapper: ({ children }) => <PhotosProvider>{children}</PhotosProvider> });
    const file = new File(["x"], "d.png", { type: "image/png" });
    const data = { dataTransfer: { files: [file] }, preventDefault: () => {}, stopPropagation: () => {} } as unknown as DragEvent;
    const container = document.getElementById('drop-zone') || document.body;
    fireEvent.drop(container, data);
    expect(await screen.findByText("d.png")).toBeTruthy();
  });

  // it("ref.triggerClick calls upload (fetch)", async () => {
  //   globalAny.fetch.mockResolvedValueOnce({ ok: true });
  //   const ref = createRef<DropZoneRef>();
  //   render(<DropZone ref={ref} />, { wrapper: ({ children }) => <PhotosProvider>{children}</PhotosProvider> });
  //   const file = new File(["x"], "r.png", { type: "image/png" });
  //   const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  //   fireEvent.change(input, { target: { files: [file] } });
  //   await waitFor(async () => {
  //     await ref.current!.triggerClick();
  //   });
  //   expect(globalAny.fetch).toHaveBeenCalled();
  // });

  // it("hides upload button when showButton=false", () => {
  //   render(<DropZone showButton={false} />, { wrapper: ({ children }) => <PhotosProvider>{children}</PhotosProvider> });
  //   const file = new File(["x"], "h.png", { type: "image/png" });
  //   const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  //   fireEvent.change(input, { target: { files: [file] } });
  //   expect(screen.queryByRole("button", { name: /upload/i })).toBeNull();
  // });
});
