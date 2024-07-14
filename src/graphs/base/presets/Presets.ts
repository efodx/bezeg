const PRESETS_PREFIX = "preset-"

interface Preset {
    id: string,
    data: string,
}

export interface Presets {
    data: Preset[]
}


export class PresetService {
    private readonly id: string;

    constructor(id: string) {
        this.id = id
    }

    loadPresets() {
        const preset = window.localStorage.getItem(PRESETS_PREFIX + this.id)
        if (preset) {
            return JSON.parse(preset) as Presets
        }
        return {data: []} as Presets
    }

    savePresets(presets: Presets) {
        window.localStorage.setItem(PRESETS_PREFIX + this.id, JSON.stringify(presets))
        console.log(JSON.stringify(presets))
    }

    removePreset(id: string) {
        const presets = this.loadPresets()
        presets.data = presets.data.filter(preset => preset.id !== id)
        this.savePresets(presets)
        return presets
    }

    savePreset(preset: Preset) {
        const presets = this.loadPresets()
        const storedPreset = presets.data.find(preset2 => preset2.id === preset.id)
        if (storedPreset) {
            storedPreset.data = preset.data
        } else {
            presets.data.push(preset)
        }
        this.savePresets(presets)
        return presets
    }

    getPreset(id: string) {
        const presets = this.loadPresets()
        return presets.data.filter(preset => preset.id === id)[0]
    }
}
