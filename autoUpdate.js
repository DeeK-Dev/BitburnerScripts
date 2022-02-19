let config = { 
    rootUrl: 'https://raw.githubusercontent.com/Deek1337/BitburnerScripts/main/'
}
export async function main(ns) {
    while (true) {
        let result = await ns.wget(`${config.rootUrl}import.js`, 'import.js');
        if (result) {
            ns.toast('Auto Update Completed');
        } else {
            ns.toast('Error updating import.js.');
        }
        await ns.sleep(120000)
        
    }
}