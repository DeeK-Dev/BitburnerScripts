import { bitNodeCheck } from "helpers.js"

let baseConfig = {
    bitNodeReq : 4,
    baseLevel : 10,
    baseRam : 2,
    baseCores : 4,
    baseCache : 1,
    upgradeAmnt : 1
}


/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");

	while (true) {
        const hacknetNodes = ns.getNumNodes()
        let hacknetLimit = {
            targetLevel : BASE_LEVEL*hacknetNodes,
            targetRAM : BASE_RAM*hacknetNodes,
            targetCores : BASE_CORES*hacknetNodes,
            targetCache : BASE_CACHE*(hacknetNodes/2)
        }

        while (hacknetNodes < 1 ) {
            buyNewServer(ns)
        }

        for (let i = 0; i < hacknetNodes; i++) {
            if (ns.hacknet.getNodeStats(i).level < hacknetLimit.targetLevel) {
                upgradeLevel(ns, i, baseConfig.upgradeAmnt)
            }
            if (ns.hacknet.getNodeStats(i).ram < hacknetLimit.targetRAM) {
                upgradeRam(ns, i, baseConfig.upgradeAmnt)
            }
            if (ns.hacknet.getNodeStats(i).cores < hacknetLimit.targetCores) {
                upgradeCores(ns, i, baseConfig.upgradeAmnt)
            }
            if (bitNodeCheck){
                if (ns.hacknet.getNodeStats(i).level < hacknetLimit.targetCache) {
                    upgradeCache(ns, i, baseConfig.upgradeAmnt)
                }
            }

        }
        buyNewServer(ns);
    }
}

function buyNewServer(ns) {
    if (ns.getServerMoneyAvailable('home') > ns.hacknet.getPurchaseNodeCost()) {
        ns.hacknet.purchaseNode()
    }
	
}

function upgradeLevel(ns, currentNode, amount) {
    if (ns.hacknet.getLevelUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeLevel(currentNode, amount) ) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + " to level " + ns.hacknet.getNodeStats(currentNode).level);
    }
}

function upgradeRam(ns, currentNode, amount) {
    if (ns.hacknet.getRamUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeQRam(currentNode, amount) ) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).ram + " to level " + ns.hacknet.getNodeStats(currentNode).ram);
    }
}

function upgradeCores(ns, currentNode, amount) {
    if (ns.hacknet.getCoresUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeCores(currentNode, amount) ) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).cores + " to level " + ns.hacknet.getNodeStats(currentNode).cores);
    }
}

function upgradeCache(ns, currentNode, amount) {
    if (ns.hacknet.getCacheUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeCache(currentNode, amount) ) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).cache + " to level " + ns.hacknet.getNodeStats(currentNode).cache);
    }
}

