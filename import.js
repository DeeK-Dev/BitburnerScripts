let config = {
  folder: 'scripts',
  rootUrl: 'https://raw.githubusercontent.com/Deek1337/BitburnerScripts/main/'
};

export async function main(ns) {
  let filesImported = await importFiles(ns);
  ns.tprint('='.repeat(20));
  if (filesImported) {
    ns.tprint('Hey! Thank you for downloading the BitBurner Scripts.');
    ns.tprint(`You've installed these in the ${config.folder} directory.`);
  } else {
    ns.tprint(
      'You had some issues downloading files, please reach out to the repo maintainer or check your config.'
    );
  }
}

async function importFiles(ns) {
  let rootFiles = [
    'autoUpdate.js',
    'utils.js'
  ]
  let files = [
    'dashboard.js',
    'hack.js',
    'serverStatus.js',
    'hacknetBoot.js',
    'scriptPush.js'
  ];

  let filesImported = true;
  for (let file of rootFiles) {
    let remoteFileName = `${config.rootUrl}${file}`;
    let result = await ns.wget(remoteFileName, `${file}`);
    filesImported = filesImported && result;
    ns.tprint(`Top Level File: ${file}: ${result ? '✔️' : '❌'}`);
  }
  for (let file of files) {
    let remoteFileName = `${config.rootUrl}scripts/${file}`;
    let result = await ns.wget(remoteFileName, `/${getFolder()}/${file}`);
    filesImported = filesImported && result;
    ns.tprint(`File: ${file}: ${result ? '✔️' : '❌'}`);
  }
  return filesImported;
}

export function getFolder() {
  return config.folder;
}

export function getHackScript() {
  return `/${getFolder()}/hack.js`;
}