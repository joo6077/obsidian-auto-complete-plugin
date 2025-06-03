// FolderCard.ts

// 1. 폴더카드
export function renderFolderCard(
	parentEl: HTMLElement,
	folderPath: string,
	onDelete: () => void,
	idx?: number
) {
	const card = parentEl.createDiv({
		cls: "folder-card",
		attr: {
			style: `
				display:flex; align-items:center; 
				background:#e8f0fe; border-radius:10px; 
				padding:10px 16px; margin-bottom:10px;
				font-size:1em; min-height:40px;`,
		},
	});
	card.createSpan({ text: folderPath, attr: { style: "flex:1;" } });
	const del = card.createSpan({
		text: "✖",
		attr: { style: "margin-left:14px; cursor:pointer;" },
	});
	del.onclick = onDelete;
	return card;
}

// 2. 폴더카드 추가 버튼 카드
export function renderAddFolderCardButton(
	parentEl: HTMLElement,
	onAdd: (folderPath: string) => void,
	allFolders: string[]
) {
	const card = parentEl.createDiv({
		cls: "folder-card plus-card",
		attr: {
			style: `
				display:flex; align-items:center; min-height:40px; 
				border:2px dashed #8fa6cb; color:#586a90;
				border-radius:10px; font-size:1em; font-weight:bold; margin-bottom:10px; padding:7px 14px;
			`,
		},
	});
	const folderInput = card.createEl("input", {
		type: "text",
		placeholder: "폴더 경로 입력(예: Notes/Inbox)",
		attr: { style: "flex:1; min-width:120px; margin-right:12px;" },
	});
	const dataListId = "folder-candidates-global";
	const dataList = card.createEl("datalist");
	dataList.id = dataListId;
	allFolders.forEach((fpath) =>
		dataList.createEl("option", { value: fpath })
	);
	folderInput.setAttr("list", dataListId);

	const plusBtn = card.createEl("button", { text: "+ Add Folder" });
	plusBtn.onclick = () => {
		const val = folderInput.value.trim();
		if (!val) return;
		onAdd(val);
		folderInput.value = "";
	};
	return card;
}
