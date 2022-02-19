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
    const bitNodeFlag = bitNodeCheck(ns, BIT_NODE);
    const currentMonies = ns.getServerMoneyAvailable('home');

    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep")
    ns.hacknet.upg

    while (true) {
        const hacknetNodes = ns.hacknet.numNodes()
        let hacknetLimit = {
            targetLevel: baseConfig.baseLevel * hacknetNodes,
            targetRam: baseConfig.baseRam * hacknetNodes,
            targetCores: baseConfig.baseCores * hacknetNodes,
            targetCache: Math.round(baseConfig.baseCache * (hacknetNodes / 2))
        }

        while (hacknetNodes < 1) {
            buyNewServer(ns)
        }

        for (let i = 0; i < hacknetNodes; i++) {
            if (ns.hacknet.getNodeStats(i).level < hacknetLimit.targetLevel) {
                upgLevel(ns, i, baseConfig.upgradeAmnt, currentMonies)
            }
            if (ns.hacknet.getNodeStats(i).ram < hacknetLimit.targetRam) {
                upgRam(ns, i, baseConfig.upgradeAmnt, currentMonies)
            }
            if (ns.hacknet.getNodeStats(i).cores < hacknetLimit.targetCores) {
                upgCores(ns, i, baseConfig.upgradeAmnt, currentMonies)
            }

            if (bitNodeFlag) {
                if (ns.hacknet.getNodeStats(i).cache < hacknetLimit.targetCache) {
                    upgCache(ns, i, baseConfig.upgradeAmnt, currentMonies)
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

function upgLevel(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getLevelUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getLevelUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeLevel(currentNode, amount)
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + " Level to " + ns.hacknet.getNodeStats(currentNode).level);
    }
}

function upgRam(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getRamUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getRamUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeRam(currentNode, amount) 
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + " RAM to " + ns.hacknet.getNodeStats(currentNode).ram);
    }
}

function upgCores(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getCoreUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getCoreUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeCore(currentNode, amount)
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + " Core(s) to " + ns.hacknet.getNodeStats(currentNode).cores);
    }
}

function upgCache(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getCacheUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getCacheUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeCache(currentNode, amount) 
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + " Cache to " + ns.hacknet.getNodeStats(currentNode).cache);
    }
}