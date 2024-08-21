import {BaseGraphState, BoardState} from "../BaseGraph";

const PRESETS_PREFIX = "preset-";

export interface Preset {
    id: string,
    data?: any,
    boardState?: BoardState,
    graphState?: BaseGraphState
}

export interface Presets {
    data: Preset[]
}


export class PresetService {
    private readonly id: string;

    constructor(id: string) {
        this.id = id;
    }

    exportAllPresetsToString() {
        const storage = {...window.localStorage};
        const exportDto: any = {};
        Object.entries(storage).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            if (key.startsWith(PRESETS_PREFIX)) {
                exportDto[key] = JSON.parse(value);
            }
        });
        return JSON.stringify(exportDto, null, '\t');
    }

    importFromString(str: string) {
        const stored = JSON.parse(str);
        Object.entries(stored).forEach(entry => {
            let key = entry[0];
            let value = JSON.stringify(entry[1]);
            window.localStorage.setItem(key, value as string);
        });
    }

    loadPresets() {
        const preset = window.localStorage.getItem(PRESETS_PREFIX + this.id);
        if (preset) {
            return JSON.parse(preset) as Presets;
        }
        return {data: []} as Presets;
    }

    savePresets(presets: Presets) {
        window.localStorage.setItem(PRESETS_PREFIX + this.id, JSON.stringify(presets));
    }

    removePreset(id: string) {
        const presets = this.loadPresets();
        presets.data = presets.data.filter(preset => preset.id !== id);
        this.savePresets(presets);
        return presets;
    }

    savePreset(preset: Preset) {
        const presets = this.loadPresets();
        console.debug("Saving preset data:");
        console.debug(preset.data);
        const storedPreset = presets.data.find(preset2 => preset2.id === preset.id);
        if (storedPreset) {
            storedPreset.data = preset.data;
        } else {
            presets.data.push(preset);
        }
        this.savePresets(presets);
        return presets;
    }

    getPreset(id: string) {
        const presets = this.loadPresets();
        return presets.data.filter(preset => preset.id === id)[0];
    }
}
