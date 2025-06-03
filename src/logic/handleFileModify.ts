// src/logic/handleFileModify.ts

import { App, parseYaml, stringifyYaml, TFile } from "obsidian";
import { AutoCompleteSettings } from "src/models/pluginSettings";

// 무한루프 방지용 글로벌 Set
const processingFiles = new Set<string>();

export async function handleFileModify(
	settings: AutoCompleteSettings,
	app: App,
	file: TFile
) {
	const fileKey = file.path;
	if (processingFiles.has(fileKey)) {
		console.log("[무한루프 방지] 처리 중 파일, PASS:", fileKey);
		return;
	}
	processingFiles.add(fileKey);

	try {
		const folders = settings.folders ?? [];
		const isTargetFolder =
			folders.length === 0 ||
			folders.some((folderPath) =>
				file.path.startsWith(folderPath + "/")
			);
		if (!isTargetFolder) return;

		const properties = await getFreshFrontmatter(app, file);
		if (!properties) return;

		for (let i = 0; i < settings.rules.length; i++) {
			const rule = settings.rules[i];
			const currValue = properties[rule.triggerProperty];

			console.log(
				`[Rule #${i + 1}] 트리거 감지!`,
				"\n- 파일:",
				file.path,
				"\n- 트리거필드:",
				rule.triggerProperty,
				"\n- 트리거값:",
				rule.triggerValue,
				"\n- 현재값:",
				currValue,
				"\n- 업데이트타입:",
				rule.updateType,
				"\n- 업데이트필드:",
				rule.updateTargetProperty,
				"\n- 넣을값:",
				rule.updateValue
			);

			let updateValue: string;

			if (currValue === undefined) continue;
			if (String(currValue) === rule.triggerValue) {
				if (rule.updateType === "date") {
					const pattern = rule.updateValue || "YYYY-MM-DD HH:mm:ss";
					updateValue = formatDateWithPattern(new Date(), pattern);
				} else {
					updateValue = rule.updateValue;
				}

				await setFrontmatterProperty(
					app,
					file,
					rule.updateTargetProperty,
					updateValue
				);
			}
		}
	} catch (error) {
	} finally {
		processingFiles.delete(fileKey);
	}
}

async function getFreshFrontmatter(app: App, file: TFile) {
	const content = await app.vault.read(file);
	// YAML 헤더 파싱 (--- ... --- 블록 추출 후 직접 파싱)
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const yamlString = match[1];
	try {
		return parseYaml(yamlString) as Record<string, any>;
	} catch (e) {
		console.error("frontmatter 파싱 오류", e);
		return {};
	}
}

function formatDateWithPattern(date: Date, pattern: string): string {
	const pad = (n: number) => n.toString().padStart(2, "0");
	return pattern
		.replace(/YYYY/g, date.getFullYear().toString())
		.replace(/MM/g, pad(date.getMonth() + 1))
		.replace(/DD/g, pad(date.getDate()))
		.replace(/HH/g, pad(date.getHours()))
		.replace(/mm/g, pad(date.getMinutes()))
		.replace(/ss/g, pad(date.getSeconds()));
}

async function setFrontmatterProperty(
	app: App,
	file: TFile,
	key: string,
	value: string
) {
	const content = await app.vault.read(file);

	// 프론트매터 파싱
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return; // frontmatter 없는 경우는 여기선 스킵
	const yamlString = match[1];
	const restContent = content.slice(match[0].length);

	let frontmatter: Record<string, any> = {};
	try {
		frontmatter = parseYaml(yamlString) as Record<string, any>;
	} catch (e) {
		console.error("frontmatter 파싱 에러:", e);
	}

	// 값만 수정
	frontmatter[key] = value;

	// 다시 YAML로
	const newYaml = stringifyYaml(frontmatter).trim();
	const newContent = `---\n${newYaml}\n---${restContent}`;

	// 파일에 덮어쓰기
	await app.vault.modify(file, newContent);
}
