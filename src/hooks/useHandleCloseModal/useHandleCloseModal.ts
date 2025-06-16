import { type RefObject, type MouseEvent, type KeyboardEvent, useEffect, useCallback } from "react";

export const useHandleCloseModal = (handleClose: VoidFunction, modalRef: RefObject<HTMLDivElement | null>) => {

	const handleModalClose = useCallback(() => {
		handleClose();
	}, [handleClose])

	const handleCloseBackdrop = useCallback((event: MouseEvent<HTMLDivElement>) => {
		if (event.target === modalRef.current) {
			handleModalClose();
		}
	}, [handleModalClose, modalRef])


	const handleCloseKeyDown = useCallback((event: KeyboardEvent | globalThis.KeyboardEvent) => {
		if (event.key === 'Escape') {
			handleModalClose();
		}
	}, [handleModalClose])

	useEffect(() => {

		document.addEventListener('keydown', handleCloseKeyDown);

		return () => {
			document.removeEventListener('keydown', handleCloseKeyDown);
		}
	}, [handleCloseKeyDown])

	return {handleCloseBackdrop}
}