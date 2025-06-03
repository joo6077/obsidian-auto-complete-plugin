export type FieldType = "string" | "number" | "date" | "boolean";

export interface Rule {
	triggerProperty: string;
	triggerValue: string;
	triggerType: FieldType;
	updateTargetProperty: string;
	updateValue: string;
	updateType: FieldType;
}

export const typeOptions: Record<FieldType, string> = {
	string: "String",
	number: "Number",
	date: "Date",
	boolean: "Boolean",
};

export interface AutoCompleteSettings {
	rules: Rule[];
	folders: string[];
}
