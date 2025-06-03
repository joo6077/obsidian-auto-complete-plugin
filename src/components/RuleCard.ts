// RuleCard.ts

import { FieldType, typeOptions, Rule } from "../models/pluginSettings";

export function renderRuleCard(
	parentEl: HTMLElement,
	rule: Rule,
	onChangeRule: (nextRule: Rule) => void,
	onDeleteRule: () => void,
	ruleIndex?: number
) {
	const dropdownOptions = Object.entries(typeOptions);

	const card = parentEl.createDiv({
		cls: "rule-card",
		attr: {
			style: `
				position: relative;
				border-radius: 8px;
				padding: 16px;
				margin-bottom: 16px;
				background-color: #fff;
				box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
			`,
		},
	});

	// 제목줄 & 삭제
	const titleRow = card.createDiv({
		attr: {
			style: `
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;
			`,
		},
	});
	titleRow.createEl("h2", {
		text: `Rule #${(ruleIndex ?? 0) + 1}`,
		attr: { style: "margin: 0; font-size: 1.1em; font-weight: bold" },
	});
	const deleteBtn = titleRow.createDiv();
	deleteBtn.setText("✖");
	deleteBtn.style.cursor = "pointer";
	deleteBtn.style.fontSize = "1em";
	deleteBtn.style.color = "#333";
	deleteBtn.style.marginLeft = "auto";
	deleteBtn.setAttr("title", "삭제");
	deleteBtn.onclick = onDeleteRule;

	// Trigger
	const triggerRow = card.createDiv({
		attr: {
			style: `
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 0.5em;
			`,
		},
	});
	triggerRow.createEl("span", {
		text: "Trigger:",
		attr: { style: "font-weight: bold;" },
	});
	const triggerInputs = triggerRow.createDiv({
		attr: { style: "display: flex; gap: 8px;" },
	});
	const triggerFieldInput = triggerInputs.createEl("input", {
		type: "text",
		value: rule.triggerProperty,
		attr: { placeholder: "Trigger Field" },
	});
	triggerFieldInput.style.width = "120px";
	triggerFieldInput.onchange = () => {
		onChangeRule({ ...rule, triggerProperty: triggerFieldInput.value });
	};
	const triggerTypeSelect = triggerInputs.createEl("select");
	for (const [val, label] of dropdownOptions) {
		const option = triggerTypeSelect.createEl("option", {
			text: label,
			value: val,
		});
		if (val === rule.triggerType) option.selected = true;
	}
	triggerTypeSelect.onchange = () => {
		onChangeRule({
			...rule,
			triggerType: triggerTypeSelect.value as FieldType,
		});
	};
	const triggerValueInput = triggerInputs.createEl("input", {
		type: "text",
		value: rule.triggerValue,
		attr: { placeholder: "Trigger Value" },
	});
	triggerValueInput.style.width = "120px";
	triggerValueInput.onchange = () => {
		onChangeRule({ ...rule, triggerValue: triggerValueInput.value });
	};

	// Update
	const updateRow = card.createDiv({
		attr: {
			style: `
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 0.5em;
			`,
		},
	});
	updateRow.createEl("span", {
		text: "Update:",
		attr: { style: "font-weight: bold;" },
	});
	const updateInputs = updateRow.createDiv({
		attr: { style: "display: flex; gap: 8px;" },
	});
	const updateFieldInput = updateInputs.createEl("input", {
		type: "text",
		value: rule.updateTargetProperty,
		attr: { placeholder: "Update Field" },
	});
	updateFieldInput.style.width = "120px";
	updateFieldInput.onchange = () => {
		onChangeRule({ ...rule, updateTargetProperty: updateFieldInput.value });
	};
	const updateTypeSelect = updateInputs.createEl("select");
	for (const [val, label] of dropdownOptions) {
		const option = updateTypeSelect.createEl("option", {
			text: label,
			value: val,
		});
		if (val === rule.updateType) option.selected = true;
	}
	updateTypeSelect.onchange = () => {
		onChangeRule({
			...rule,
			updateType: updateTypeSelect.value as FieldType,
		});
	};
	const updateValueInput = updateInputs.createEl("input", {
		type: "text",
		value: rule.updateValue,
		attr: { placeholder: "Update Value" },
	});
	updateValueInput.style.width = "120px";
	updateValueInput.onchange = () => {
		onChangeRule({ ...rule, updateValue: updateValueInput.value });
	};

	return card;
}

// 2. 룰카드 추가 버튼 카드
export function renderAddRuleCardButton(
	parentEl: HTMLElement,
	onAdd: () => void
) {
	const card = parentEl.createDiv({
		cls: "rule-card plus-card",
		attr: {
			style: `
				display:flex; justify-content:center; align-items:center; 
				min-height:56px; cursor:pointer; border:2px dashed #aaa; color:#777;
				border-radius:12px; font-size:1.1em; font-weight:bold; margin-bottom:16px;
			`,
		},
	});
	card.setText("+ Add Rule");
	card.onclick = onAdd;
	return card;
}
