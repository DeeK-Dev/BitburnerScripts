import { bitNodeCheck } from "helpers.js"
const BIT_NODE = 4

let baseConfig = {
    baseLevel: 10,
    baseRam: 2,
    baseCores: 4,
    baseCache: 1,
    upgradeAmnt: 1
}
 
/** @param {NS} ns **/
export async function main(ns) {
    let bitNodeFlag = bitNodeCheck(ns, BIT_NODE)
    
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep")
    ns.hacknet.upg

    while (true) {
        const hacknetNodes = ns.hacknet.numNodes()
        let hacknetLimit = {
            targetLevel: baseConfig.baseLevel * hacknetNodes,
            targetRAM: baseConfig.baseRam * hacknetNodes,
            targetCores: baseConfig.baseCores * hacknetNodes,
            targetCache: Math.round(baseConfig.baseCache * (hacknetNodes / 2))
        }

        while (hacknetNodes < 1) {
            buyNewServer(ns)
        }

        for (let i = 0; i < hacknetNodes; i++) {
            if (ns.hacknet.getNodeStats(i).level < hacknetLimit.targetLevel) {
                upgLevel(ns, i, baseConfig.upgradeAmnt)
            }
            if (ns.hacknet.getNodeStats(i).ram < hacknetLimit.targetRAM) {
                upgRam(ns, i, baseConfig.upgradeAmnt)
            }
            if (ns.hacknet.getNodeStats(i).cores < hacknetLimit.targetCores) {
                upgCores(ns, i, baseConfig.upgradeAmnt)
            }
            
            if (bitNodeFlag) {
                if (ns.hacknet.getNodeStats(i).cache < hacknetLimit.targetCache) {
                    upgCache(ns, i, baseConfig.upgradeAmnt)
                }
            }

        }
        buyNewServer(ns);
        await ns.sleep(0)
    }
}

function buyNewServer(ns) {
    if (ns.getServerMoneyAvailable('home') > ns.hacknet.getPurchaseNodeCost()) {
        ns.hacknet.purchaseNode()
    }

}

function upgLevel(ns, currentNode, amount) {
    if (ns.hacknet.getLevelUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeLevel(currentNode, amount)) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + " to level " + ns.hacknet.getNodeStats(currentNode).level);
    }
}

function upgRam(ns, currentNode, amount) {
    if (ns.hacknet.getRamUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeRam(currentNode, amount)) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).ram + " to level " + ns.hacknet.getNodeStats(currentNode).ram);
    }
}

function upgCores(ns, currentNode, amount) {
    if (ns.hacknet.getCoreUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeCore(currentNode, amount)) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).cores + " to level " + ns.hacknet.getNodeStats(currentNode).cores);
    }
}

function upgCache(ns, currentNode, amount) {
    if (ns.hacknet.getCacheUpgradeCost(currentNode, amount) < Infinity && ns.hacknet.upgradeCache(currentNode, amount)) {
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).cache + " to level " + ns.hacknet.getNodeStats(currentNode).cache);
    }
}

