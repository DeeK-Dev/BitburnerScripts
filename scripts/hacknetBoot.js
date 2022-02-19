import { bitNodeCheck } from "helpers.js"

const baseConfig = {
    BIT_NODE = 4,
    BASE_LEVEL = 10,
    BASE_RAM = 2,
    BASE_CORES = 4,
    BASE_CACHE = 1,
    UPGRADE_AMNT = 1
}


/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");

	while (true) {
        const hacknetNodes = ns.getNumNodes()
        let hacknetLimit = {
            targetLevel = BASE_LEVEL*hacknetNodes,
            targetRAM = BASE_RAM*hacknetNodes,
            targetCores = BASE_CORES*hacknetNodes,
            targetCache = BASE_CACHE*(hacknetNodes/2)
        }

        while (hacknetNodes < 1 ) {
            buyNewServer(ns)
        }

        for (let i = 0; i < hacknetNodes; i++) {
            if (ns.hacknet.getNodeStats(i).level < hacknetLimit.targetLevel) {
                upgradeLevel(ns, i, baseConfig.UPGRADE_AMNT)
            }
            if (ns.hacknet.getNodeStats(i).ram < hacknetLimit.targetRAM) {
                upgradeRam(ns, i, baseConfig.UPGRADE_AMNT)
            }
            if (ns.hacknet.getNodeStats(i).cores < hacknetLimit.targetCores, baseConfig.UPGRADE_AMNT) {
                upgradeCores(ns, i, baseConfig.UPGRADE_AMNT)
            }
            if (bitNodeCheck){
                if (ns.hacknet.getNodeStats(i).level < hacknetLimit.targetCache, baseConfig.UPGRADE_AMNT) {
                    upgradeCache(ns, i, baseConfig.UPGRADE_AMNT)
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

