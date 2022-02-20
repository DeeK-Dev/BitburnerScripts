import { bitNodeCheck, hashControl } from "utils.js"
const BIT_NODE = 4

let baseConfig = {
    baseLevel: 5,
    baseRam: 2,
    baseCores: 1,
    baseCache: 1,
    upgradeAmnt: 1,
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.tail("/scripts/hacknetBoot.js", "home")
    const bitNodeFlag = bitNodeCheck(ns, BIT_NODE);

    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep")

    while (true) {
        const currentMonies = ns.getServerMoneyAvailable('home');
        const hacknetNodes = ns.hacknet.numNodes()
        let hacknetLimit = {
            targetLevel: Math.round(baseConfig.baseLevel * (hacknetNodes/1.2) + hacknetNodes),
            targetRam: Math.round(baseConfig.baseRam**(hacknetNodes-1)),
            targetCores: Math.round(baseConfig.baseCores * (hacknetNodes * 1.2)),
            targetCache: Math.round((baseConfig.baseCache * hacknetNodes) / 2.5)
        }

        while (hacknetNodes < 1) {
            buyNewServer(ns)
            await ns.sleep(1000)
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
        hashControl(ns)
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
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + "'s Level to " + ns.hacknet.getNodeStats(currentNode).level);
    }
}

function upgRam(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getRamUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getRamUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeRam(currentNode, amount)
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + "'s RAM to " + ns.hacknet.getNodeStats(currentNode).ram);
    }
}

function upgCores(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getCoreUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getCoreUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeCore(currentNode, amount)
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + "'s Core(s) to " + ns.hacknet.getNodeStats(currentNode).cores);
    }
}

function upgCache(ns, currentNode, amount, currentMonies) {
    if (ns.hacknet.getCacheUpgradeCost(currentNode, amount) < Infinity && currentMonies > ns.hacknet.getCacheUpgradeCost(currentNode, amount)) {
        ns.hacknet.upgradeCache(currentNode, amount)
        ns.print("Upgraded " + ns.hacknet.getNodeStats(currentNode).name + "'s Cache to " + ns.hacknet.getNodeStats(currentNode).cache);
    }
}

