export function waitToBeAddedToDom(
	elem: HTMLElement,
	callback: () => void,
): void {
	const ob = new MutationObserver((ml) => {
		for (const m of ml) {
			if (m.type !== 'childList') {
				continue;
			}

			m.addedNodes.forEach((elem) => {
				if (!elem.contains(elem)) {
					return;
				}
				callback();
				ob.disconnect();
			});
		}
	});

	const doc = elem.ownerDocument;
	ob.observe(doc.body, {
		attributes: true,
		childList: true,
		subtree: true,
	});
}
