import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHandleCloseModal } from "./useHandleCloseModal";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockHandleClose = vi.fn();

const TestComponent = () => {
	const modalRef = useRef<HTMLDivElement>(null);
	const { handleCloseBackdrop } = useHandleCloseModal(mockHandleClose, modalRef);

	return (
		<div data-testid="backdrop" ref={modalRef} onClick={handleCloseBackdrop} >
			<div data-testid="modal-content" > Modal Content </div >
		</div >
	);
};

describe('useHandleCloseModal', () => {

	beforeEach(() => {
		mockHandleClose.mockClear();
	});

	it('should call handleClose when clicking on backdrop', async () => {
		render(<TestComponent />);

		await userEvent.click(screen.getByTestId('backdrop'));

		expect(mockHandleClose).toHaveBeenCalledOnce();
	});

	it('should not call handleClose when clicking inside modal content', async () => {

		render(<TestComponent />);

		await userEvent.click(screen.getByTestId('modal-content'));

		expect(mockHandleClose).not.toHaveBeenCalledOnce();
	});

	it('should call handleClose when pressing Escape key', async () => {

		render(<TestComponent />);

		await userEvent.keyboard('{Escape}');

		expect(mockHandleClose).toHaveBeenCalledOnce();
	});

	it('should NOT call handleClose when pressing other keys', async () => {

		render(<TestComponent />);

		await userEvent.keyboard('{Enter}');

		expect(mockHandleClose).not.toHaveBeenCalledOnce();
	});

	it('should clean up event listener on unmount', () => {

		const spyAdd = vi.spyOn(document, 'addEventListener');
		const spyRemove = vi.spyOn(document, 'removeEventListener');
		const { unmount } = render(<TestComponent />);

		expect(spyAdd).toHaveBeenCalledWith('keydown', expect.any(Function));
		expect(spyAdd).toHaveBeenCalledOnce();

		unmount();

		expect(spyRemove).toHaveBeenCalledWith('keydown', expect.any(Function));
		expect(spyRemove).toHaveBeenCalledOnce();
	});

	it('should update callbacks when dependencies change', async () => {

		const { rerender } = renderHook(
			({ handleClose, ref }) => useHandleCloseModal(handleClose, ref),
			{
				initialProps: {
					handleClose: mockHandleClose,
					ref: {current: document.createElement('div')},
				}
			}
		)

		const newMockHandleClose = vi.fn();
		const newRef = { current: document.createElement('div') };

		rerender({
			handleClose: newMockHandleClose,
			ref: newRef
		})
		
		await userEvent.keyboard('{Escape}');

		expect(newMockHandleClose).toHaveBeenCalledOnce();
		expect(mockHandleClose).not.toHaveBeenCalled();
	});
});