import { effect, signal } from "@lit-labs/preact-signals";
import { Link } from "./models";
import * as db from './local-store';


function buildAppState() {
    const links = signal([] as Link[]);
    db.findAllLinks().then(result => links.value = result);
    effect(() => {
        console.log("links updated");
    });
    return {
        links : links,
    }
}

export const appState = buildAppState(); 