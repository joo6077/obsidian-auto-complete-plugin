import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	TFolder,
} from "obsidian";

import {
	AutoCompleteSettings,
	FieldType,
	Rule,
	typeOptions,
} from "./src/models/pluginSettings";
import {
	renderAddRuleCardButton,
	renderRuleCard,
} from "src/components/RuleCard";
import {
	renderAddFolderCardButton,
	renderFolderCard,
} from "src/components/FolderSelector";
import { handleFileModify } from "src/logic/handleFileModify";

// Remember to rename these classes and interfaces!

export default class AutoCompletePlugin extends Plugin {
	settings: AutoCompleteSettings;

	async onload() {
		await this.loadSettings();

		console.log("=== [AutoCompletePlugin Settings] ===");
		console.log("- 추적 폴더:", this.settings.folders ?? []);
		console.log("- 규칙 목록:", this.settings.rules ?? []);

		this.registerEvent(
			this.app.vault.on("modify", (file) => {
				if (file instanceof TFile && file.extension === "md") {
					handleFileModify(this.settings, this.app, file);
				}
			})
		);
		// 세팅 탭 (GUI)
		this.addSettingTab(new AutoCompleteSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const loaded = (await this.loadData()) ?? {};
		this.settings = {
			rules: loaded.rules ?? [],
			folders: loaded.folders ?? [],
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class AutoCompleteSettingTab extends PluginSettingTab {
	plugin: AutoCompletePlugin;

	constructor(app: App, plugin: AutoCompletePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// -- 룰카드 리스트 + 추가 버튼
		containerEl.createEl("h2", {
			text: "🔧 규칙 리스트",
			attr: {
				style: "font-size: 1.3em;",
			},
		});
		const rulesContainer = containerEl.createDiv();
		this.plugin.settings.rules.forEach((rule, i) => {
			renderRuleCard(
				rulesContainer,
				rule,
				async (nextRule) => {
					this.plugin.settings.rules[i] = nextRule;
					await this.plugin.saveSettings();
					this.display();
				},
				async () => {
					this.plugin.settings.rules.splice(i, 1);
					await this.plugin.saveSettings();
					this.display();
				},
				i
			);
		});

		renderAddRuleCardButton(rulesContainer, async () => {
			this.plugin.settings.rules.push({
				triggerProperty: "",
				triggerType: "string",
				triggerValue: "",
				updateTargetProperty: "",
				updateType: "string",
				updateValue: "",
			});
			await this.plugin.saveSettings();
			this.display();
		});

		// -- 폴더카드 리스트 + 추가 버튼
		containerEl.createEl("h2", {
			text: "📁 추적 폴더 리스트",
			attr: {
				style: "margin: 48px 0 24px 0; font-size: 1.3em;",
			},
		});
		const folderCardList = containerEl.createDiv();
		this.plugin.settings.folders.forEach((folder, i) => {
			renderFolderCard(
				folderCardList,
				folder,
				async () => {
					this.plugin.settings.folders.splice(i, 1);
					await this.plugin.saveSettings();
					this.display();
				},
				i
			);
		});
		const allFolders = this.app.vault
			.getAllLoadedFiles()
			.filter((f) => f instanceof TFolder)
			.map((f) => f.path);

		renderAddFolderCardButton(
			folderCardList,
			async (folderPath) => {
				if (!this.plugin.settings.folders.includes(folderPath)) {
					this.plugin.settings.folders.push(folderPath);
					await this.plugin.saveSettings();
					this.display();
				}
			},
			allFolders
		);
	}
}
