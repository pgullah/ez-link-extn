import { html } from "lit"
import { Consumer, KeyOption, Supplier, } from "./models"

export type AdditionalAttributes = {
    required?: boolean
    type?: string
}

export function renderReactiveInput(label: string, 
    getter: Supplier<string | undefined>, 
    setter: Consumer<string>, attribues?: AdditionalAttributes) {
    return html`
        <md-filled-text-field autofocus="" label="${label}" role="presentation" inputmode="" 
            type="${attribues?.type ?? 'text'}" 
            autocomplete="" 
            ?required=${attribues?.required}
            value="${getter()}" 
            @change=${setInputValue(setter)}>
        </md-filled-text-field>
    `
}

export function renderReactiveSelect(label: string, options: KeyOption[], 
    getter: Supplier<string | undefined>, 
    setter: Consumer<string>, attribues?: AdditionalAttributes) {
    return html`
        <md-outlined-select name=${label} @change=${setInputValue(setter)} ?required=${attribues?.required}>
            ${options.map(o => html`<md-select-option value=${o.key} ?selected=${o.key == getter()}><div slot="headline">${o.value}</div></option>`)}
        </md-outlined-select>
    `
}

export function setInputValue(setter: Consumer<string>) {
    return (evt: Event) => setter((evt.target as HTMLInputElement).value)
}
