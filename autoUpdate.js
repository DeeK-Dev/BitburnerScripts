let config = {
    folder: 'scripts',
    rootUrl: 'https://raw.githubusercontent.com/Deek1337/BitburnerScripts/main/'
}

async function main() {
    while (true) {
        let dt = Date.now();
        let result = await ns.wget(`${config.rootUrl}import.js`, '/import.js');
        if (result ? ns.toast(`Auto Update Completed @ ${dt}`) : ns.toast(`Error updating import.js. @ ${dt} `))

    }
}
