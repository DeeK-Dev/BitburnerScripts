import { scriptTarget, ratioGen, threadCalc, spider } from 'utils.js'
/** @param {NS} ns **/
export async function main(ns) {
	const serverListRaw = await spider(ns);
	const selection = ns.args[0];
	switch (selection) {
		case "help":
			help(ns);
			break;
		case "purchased":
		case "-p":
			await homeServers(ns, serverListRaw);
			break;
		case "internal":
		case "-i":
			await internalServers(ns, serverListRaw);
			break;
		case "external":
		case "-e":
			await externalServers(ns, serverListRaw);
			break;
		case "hacknet":
		case "-h":
			await hackServers(ns, serverListRaw);
			break;
		case "all":
		case "-a":
			await allServers(ns, serverListRaw);
			break;
		default:
			help(ns)
	}
}

async function hackServers(ns, servers) {
	let serverList = servers.filter(s => s.includes("hacknet-node"))
	await push(ns, serverList)
}

async function homeServers(ns, servers) {
	let serverList = servers.filter(s => s.includes("pserv-"))
	ns.tprint("home Check")
	await push(ns, serverList)
}

async function internalServers(ns, servers) {
	let serverList = servers.filter(s => s.includes("pserv-") && s.includes("hacknet-node-"))
	ns.tprint("internal Check")
	await push(ns, serverList)
}

async function externalServers(ns, servers) {
	let serverList = servers.filter(s => s != "home" && !s.includes("hacknet-node-") && !s.includes("pserv-") && ns.hasRootAccess(s))
	ns.tprint("external Check")
	await push(ns, serverList)
}

async function allServers(ns, servers) {
	let serverList = servers.filter(s => s != "home" && ns.hasRootAccess(s))
	ns.tprint("all Check")
	await push(ns, serverList)
}

function help(ns) {
	ns.tprint("This script pushes set scripts to others servers.")
	ns.tprint("arguments you can use are:")
	ns.tprint("purchased: Pushes to your purchased servers only.")
	ns.tprint("external: Pushes to all external servers you have access to.")
	ns.tprint("internal: Pushes to all internal servers. Purchased and Hacknet (BN4)")
	ns.tprint("hacknet: Pushes scripts to hacknet servers only (BN4)")
	ns.tprint("all: Pushes to all servers, both internal and external.")
}
/** @param {NS} ns **/
async function push(ns, serverList) {
	const target = await scriptTarget(ns)
	//Depending on target, set scriptlist to push to purchased servers.
	const scriptList = [`${target}-grow.js`, `${target}-weaken.js`];

	for (let i = 0; i < serverList.length; ++i) {
		ns.killall(serverList[i]);
		for (let j = 0; j < scriptList.length; ++j) {
			let scriptRam = ns.getScriptRam(scriptList[j]);
			await ns.scp(scriptList, serverList[i]);
			ns.exec(scriptList[j], serverList[i], await threadCalc(ns.getServerMaxRam(serverList[i]), scriptRam, await ratioGen(scriptList.length)));
		}
	}

}