const cmd = require('node-cmd');
const args = process.argv;
const fs = require('fs');
/** FLAGS
 * --env
 */
const flags = [{
    flagSymbol: ['-env', '-e'],
    flagName: 'environment',
    flagValue: ''
}];

args.forEach((arg, argIndex) => {
    // if args match flagSymbol, assign the next indexElement to flagValue
    flags.forEach(flag => {
        if(flag.flagSymbol.indexOf(arg) >= 0){
            flag.flagValue = args[argIndex+1];
        }
    })
});

const environmentValue = flags.filter(flag => flag.flagName === 'environment')[0].flagValue;

new Promise((resolve, reject) => {
    fs.readdir('./config', (err, files) => {
        if(err) return reject(err);
        if(!files) return reject('no files found, is /config directory exists');
        const foundFileName = files.filter(file => {
            return file.indexOf(environmentValue) >= 0
        })[0];
        resolve(foundFileName);
    })
})
.then(foundFileName => {
    // 1. set the heroku-app-name
    // 2. assign each variable to heroku:config
    return new Promise((outerResolve, reject) => {
        fs.readFile('./config/'+foundFileName, 'utf8', (err, data) => {
            if(err) return reject(err);

            let herokuAppName;
            const arrayData = data.split('\n');
            new Promise(resolve => {
                if(arrayData[0].indexOf('heroku-app-name=') === 0){
                    const line = arrayData[0];
                    herokuAppName = line.replace('heroku-app-name=', '');
                    cmdAsync(`git remote rm heroku`);
                    cmdAsync(`heroku git:remote -a ${herokuAppName}`)
                    // cmdAsync(`git remote set-url heroku https://git.heroku.com/${herokuAppName}.git`)
                     .then(result => {
                         setTimeout(() => resolve(), 1000)
                     })
                } else {
                    throw new Error('must define heroku-app-name at first line');
                }
            })
            .then(result => {
                const configSet = arrayData.map(line => {
                    if(!line || line.indexOf('=') < 0) return Promise.resolve();
                    return cmdAsync(`heroku config:set ${line}`)
                });
                Promise.all(configSet)
                .then(outerResolve)

            })
            
            
        })
    })
})
.then(result => {
    // push this file to heroku
    cmdAsync(`git push staging master`);
})
.catch(messageError => {
    console.log(messageError);
    throw new Error(messageError);
})

// open config dir and find .env_[environmentValue] or .env-[environmentValue]
// if not found throw error, file not found
// if found open the file


    // get heroku app name
    // set heroku app name
    // heroku git:remote -a [heroku-app-name]

    // and loop for each line and set the environment
    // remove '\n'
    // heroku config:set [eachline]

    //




// helper
const cmdAsync = (commandLineString) => {
    return new Promise((resolve, reject) => {
        cmd.get(
            commandLineString,
            function(err, data, stderr){
                console.log(data);
                if(err) console.log(err)
                if(stderr) console.log(stderr)
                resolve();
                if(err) return reject(err);
                if(stderr) return reject(stderr);
                if(data) return resolve(data)
            }
        );
    })
};


const forEachAsync = (array, func, index=0) => {
    let lastIndex = array.length-1;
    if(index > lastIndex) return;

    function next(nextIndex){
        return function(){
            return forEachAsync(array, func, nextIndex);
        }
    }
    const currentElement = array[index];
    const currentIndex = index;
    const nextIndex = index + 1;
    return func(currentElement, currentIndex, next(nextIndex))
}